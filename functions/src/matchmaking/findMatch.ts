import OpenAI from 'openai';
import { supabase } from '../../../config/supabase';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const MINIMUM_COMPATIBILITY = 65;

interface UserProfile {
    user_id: string;
    username: string;
    demographics: {
      age: number;
      birth_date: number;
      city: string;
      gender: string;
      state: string;
    };
    onboarding_responses: {
      aspirations: string;
      entertainment: string;
      hobbies: string;
      location: string;
      music: string;
      travel: string;
    };
    user_stats: {
      ai_interactions: number;
      conversations_started: number;
      messages_sent: number;
    };
    matches?: {
      match_id: string;
      user_id: string;
      timestamp: number;
      status: 'active' | 'archived';
    }[];
}

export interface MatchRecord {
    users: [string, string];
    timestamp: number;
    compatibility_score: number;
    waiting_score: number;
    final_score: number;
    match_number: number;
    is_initial_match: boolean;
    match_quality: {
      message_count: number;
      conversation_length: number;
      last_message_timestamp: number | null;
    };
}

interface MatchResponse {
    match: {
        userId: string;
        compatibilityScore: number;
        matchReason?: string;
        commonInterests?: string[];
    };
}

export async function findMatch(userId: string) {
    try {
        console.log("Processing for user:", userId);
        
        // Get user data from Supabase
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select(`
                *,
                demographics (*),
                onboarding_responses (*),
                user_stats (*)
            `)
            .eq('user_id', userId)
            .single();

        if (userError || !userData) {
            throw new Error('User profile not found');
        }

        const potentialMatches = await getPotentialMatches(userId, userData.demographics.age);
        console.log(`Found ${potentialMatches.length} potential matches`);

        let attempts = 0;
        const maxAttempts = 3;
        let match: MatchResponse | undefined;

        while (attempts < maxAttempts) {
            try {
                match = await findMatchWithGPT(userData, potentialMatches);
                console.log("Found match:", match);
                break;
            } catch (error) {
                console.error(`Match attempt ${attempts + 1} failed:`, error);
                attempts++;
                if (attempts === maxAttempts) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!match || !match.match) {
            throw new Error('No valid match found');
        }

        // Get last match timestamp
        const { data: lastMatch } = await supabase
            .from('matches')
            .select('timestamp')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        const lastMatchTimestamp = lastMatch?.timestamp || 0;
        const hoursSinceLastMatch = lastMatchTimestamp ? 
            (Date.now() - lastMatchTimestamp) / (1000 * 60 * 60) :
            48;

        const waitingScore = calculateWaitingScore(hoursSinceLastMatch);
        const finalScore = (match.match.compatibilityScore * 0.7) + (waitingScore * 0.3);

        // Get current match count
        const { count: currentMatchCount } = await supabase
            .from('matches')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);

        const matchId = await recordMatch(userId, match.match.userId, {
            compatibilityScore: match.match.compatibilityScore,
            waitingScore,
            finalScore,
            matchNumber: (currentMatchCount || 0) + 1,
            isInitialMatch: (currentMatchCount || 0) < 5
        });

        return {
            matchId,
            userId: match.match.userId,
            scores: {
                compatibility: match.match.compatibilityScore,
                waiting: waitingScore,
                final: finalScore
            }
        };
    } catch (error) {
        console.error('Friend matching error:', error);
        throw error;
    }
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getAgeRange(age: number): { minAge: number; maxAge: number } {
    if (age === 18) return { minAge: 18, maxAge: 22 };
    if (age === 19) return { minAge: 18, maxAge: 23 };
    if (age === 20) return { minAge: 18, maxAge: 24 };
    if (age === 21) return { minAge: 18, maxAge: 25 };

    return {
        minAge: Math.max(18, age - 4),
        maxAge: age + 4
    };
}

function calculateWaitingScore(hoursSinceLastMatch: number): number {
    if (hoursSinceLastMatch <= 24) return 0;
    const hoursOverMinimum = hoursSinceLastMatch - 24;
    return Math.min(Math.pow(hoursOverMinimum / 13, 2.7) * 100, 100);
}

async function getPotentialMatches(userId: string, userAge: number) {
    const { minAge, maxAge } = getAgeRange(userAge);

    const { data: potentialMatches, error } = await supabase
        .from('profiles')
        .select(`
            *,
            demographics (*),
            onboarding_responses (*),
            user_stats (*)
        `)
        .gte('demographics.age', minAge)
        .lte('demographics.age', maxAge)
        .neq('user_id', userId)
        .limit(40);

    if (error) throw error;

    return shuffleArray(potentialMatches || []);
}

function prepareProfileForGPT(user: UserProfile) {
    return {
        userId: user.user_id,
        username: user.username,
        demographics: user.demographics,
        interests: {
            creative: user.onboarding_responses.hobbies,
            lifestyle: user.onboarding_responses.location,
            music: user.onboarding_responses.music,
            entertainment: user.onboarding_responses.entertainment,
            travel: user.onboarding_responses.travel,
            goals: user.onboarding_responses.aspirations
        }
    };
}

async function generateMatchPrompt(userProfile: UserProfile, potentialMatches: UserProfile[]) {
    return `Analyze these profiles and find the most compatible friend match.

MAIN USER:
${JSON.stringify(prepareProfileForGPT(userProfile), null, 2)}

POTENTIAL MATCHES:
${JSON.stringify(potentialMatches.map(prepareProfileForGPT), null, 2)}

Instructions:
1. Analyze their interests focusing on:
   - Creative pursuits and hobbies
   - Music and entertainment preferences
   - Life experiences and relationships
   - Travel experiences and aspirations
   - Personal goals and growth areas

2. Look for matches that have:
   - Strong common ground
   - Complementary differences
   - Similar values with different perspectives

Return only a JSON object:
{
  "match": {
    "userId": "string",
    "compatibilityScore": number
  }
}`;
}

async function getOpenAIKey() {
  try {
      console.log("Initializing SecretManagerServiceClient");
      const secretManager = new SecretManagerServiceClient();
      
      const secretName = 'projects/792301576889/secrets/OPENAI_API_KEY/versions/latest';
      console.log("Attempting to access secret:", secretName);
      
      const [version] = await secretManager.accessSecretVersion({
          name: secretName
      });
      
      if (!version.payload?.data) {
          const error = new Error('No secret payload found in Secret Manager');
          console.error(error);
          throw error;
      }

      const apiKey = version.payload.data.toString();
      console.log("Successfully retrieved OpenAI key");
      
      // Verify the key is not empty or malformed
      if (!apiKey || apiKey.length < 20) {  // OpenAI keys are typically longer
          throw new Error('Retrieved OpenAI key appears to be invalid');
      }

      return apiKey;
    } catch (error: any) {  // Type as 'any' or use type guard
      console.error("Error retrieving OpenAI key:", {
          message: error?.message || 'Unknown error',
          name: error?.name,
          stack: error?.stack
      });
      throw new Error(`Failed to retrieve OpenAI API key: ${error?.message || 'Unknown error'}`);
  }
}

async function findMatchWithGPT(userProfile: UserProfile, potentialMatches: UserProfile[]): Promise<MatchResponse> {
    const apiKey = await getOpenAIKey();
    const openai = new OpenAI({ apiKey });
    const prompt = await generateMatchPrompt(userProfile, potentialMatches);
  
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an expert at analyzing profiles and finding meaningful friendship matches.'
            },
            { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
        throw new Error('No response content from GPT');
    }
    const match = JSON.parse(responseContent);

    if (match.match.compatibilityScore < MINIMUM_COMPATIBILITY) {
        const newPotentialMatches = potentialMatches.filter(p => p.user_id !== match.match.userId);
        if (newPotentialMatches.length > 0) {
            return findMatchWithGPT(userProfile, newPotentialMatches);
        }
    }

    return match;
}

async function recordMatch(userId1: string, userId2: string, matchDetails: {
    compatibilityScore: number;
    waitingScore: number;
    finalScore: number;
    matchNumber: number;
    isInitialMatch: boolean;
}) {
    const timestamp = Date.now();

    const { data: match, error } = await supabase
        .from('matches')
        .insert([{
            users: [userId1, userId2],
            timestamp,
            compatibility_score: matchDetails.compatibilityScore,
            waiting_score: matchDetails.waitingScore,
            final_score: matchDetails.finalScore,
            match_number: matchDetails.matchNumber,
            is_initial_match: matchDetails.isInitialMatch,
            match_quality: {
                message_count: 0,
                conversation_length: 0,
                last_message_timestamp: null
            }
        }])
        .select()
        .single();

    if (error) throw error;

    // Update user stats and matches for both users
    await Promise.all([
        supabase.from('user_stats').upsert([{
            user_id: userId1,
            conversations_started: supabase.rpc('increment', { row_id: userId1, amount: 1 })
        }]),
        supabase.from('user_stats').upsert([{
            user_id: userId2,
            conversations_started: supabase.rpc('increment', { row_id: userId2, amount: 1 })
        }])
    ]);

    return match.id;
}

export default findMatch;
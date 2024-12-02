import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();
const MINIMUM_COMPATIBILITY = 65;

interface UserProfile {
    uid: string;
    username: string;
    demographics: {
      age: number;
      birthDate: number;
      city: string;
      gender: string;
      state: string;
    };
    onboarding: {
      responses: {
        aspirations: { answer: string; updatedAt: null };
        entertainment: { answer: string; updatedAt: null };
        hobbies: { answer: string; updatedAt: null };
        location: { answer: string; updatedAt: null };
        music: { answer: string; updatedAt: null };
        relationships: { answer: string; updatedAt: null };
        travel: { answer: string; updatedAt: null };
      };
      status: {
        completedAt: Timestamp;
        isComplete: boolean;
        lastUpdated: Timestamp;
      };
    };
    stats: {
      aiInteractions: number;
      conversationsStarted: number;
      messagesSent: number;
    };
    matches?: {
        [matchId: string]: {
          userId: string;
          timestamp: number;
          status: 'active' | 'archived';
        };
    };
}
  
interface MatchRecord {
    users: [string, string];
    timestamp: number;
    compatibilityScore: number;
    waitingScore: number;
    finalScore: number;
    matchNumber: number;
    isInitialMatch: boolean;
    matchQuality: {
      messageCount: number;
      conversationLength: number;
      lastMessageTimestamp: number | null;
    };
}

interface MatchResponse {
    match: {
      userId: string;
      compatibilityScore: number;
    };
}

export const findMatch = onCall({ 
    region: 'us-central1',
    memory: "1GiB",
    timeoutSeconds: 300,
    enforceAppCheck: false,
    ingressSettings: "ALLOW_ALL",
    cors: true,
}, async (request) => {
    try {
        const { userId } = request.data;
        console.log("Processing for user:", userId);
        
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data() as UserProfile;
        
        if (!userData) {
          console.error(`User data not found for ID: ${userId}`);
          throw new HttpsError('not-found', 'User profile not found');
      }
      console.log("Found user data:", { userId, hasProfile: true });

        const potentialMatches = await getPotentialMatches(userId, userData.demographics.age);
        console.log(`Found ${potentialMatches.length} potential matches`);

        let attempts = 0;
        const maxAttempts = 3;
        let match: MatchResponse | undefined;

        while (attempts < maxAttempts) {
          try {
              console.log(`Attempting match ${attempts + 1} of ${maxAttempts}`);
              match = await findMatchWithGPT(userData, potentialMatches as UserProfile[]);
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
            throw new HttpsError('internal', 'No valid match found');
        }

        const lastMatchTimestamp = userData.matches ? 
            Math.max(...Object.values(userData.matches).map(m => m.timestamp)) :
            0;

        const hoursSinceLastMatch = lastMatchTimestamp ? 
            (Date.now() - lastMatchTimestamp) / (1000 * 60 * 60) :
            48;

        const waitingScore = calculateWaitingScore(hoursSinceLastMatch);
        const finalScore = (match.match.compatibilityScore * 0.7) + (waitingScore * 0.3);
        const currentMatchCount = userData.matches ? Object.keys(userData.matches).length : 0;

        const matchId = await recordMatch(userId, match.match.userId, {
            compatibilityScore: match.match.compatibilityScore,
            waitingScore,
            finalScore,
            matchNumber: currentMatchCount + 1,
            isInitialMatch: currentMatchCount < 5
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
        throw new HttpsError('internal', 'Error processing friend match');
    }
});

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

function prepareProfileForGPT(user: UserProfile) {
    const { responses } = user.onboarding;
    return {
        userId: user.uid,
        username: user.username,
        demographics: user.demographics,
        interests: {
            creative: responses.hobbies?.answer,
            lifestyle: responses.location?.answer,
            relationships: responses.relationships?.answer,
            music: responses.music?.answer,
            entertainment: responses.entertainment?.answer,
            travel: responses.travel?.answer,
            goals: responses.aspirations?.answer
        }
    };
}

async function getPotentialMatches(userId: string, userAge: number) {
    const { minAge, maxAge } = getAgeRange(userAge);
    const usersRef = db.collection('users');
  
    const eligibleMatches = await usersRef
        .where('demographics.age', '>=', minAge)
        .where('demographics.age', '<=', maxAge)
        .where('onboarding.status.isComplete', '==', true)
        .where(admin.firestore.FieldPath.documentId(), '!=', userId)
        .get();
  
    let potentialMatches = eligibleMatches.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    }));
  
    if (potentialMatches.length > 40) {
        potentialMatches = shuffleArray(potentialMatches).slice(0, 40);
    }
  
    return potentialMatches;
}

async function getOpenAIKey() {
    const secretManager = new SecretManagerServiceClient();
    const [version] = await secretManager.accessSecretVersion({
        name: 'projects/792301576889/secrets/OPENAI_API_KEY/versions/latest',
    });
    if (!version.payload || !version.payload.data) {
        throw new Error('Failed to retrieve OpenAI API key from Secret Manager');
    }
    return version.payload.data.toString();
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
        const newPotentialMatches = potentialMatches.filter(p => p.uid !== match.match.userId);
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
    const batch = db.batch();
    const timestamp = Date.now();
  
    const matchRef = db.collection('matches').doc();
    const matchRecord: MatchRecord = {
        users: [userId1, userId2],
        timestamp,
        ...matchDetails,
        matchQuality: {
            messageCount: 0,
            conversationLength: 0,
            lastMessageTimestamp: null
        }
    };
    
    batch.set(matchRef, matchRecord);
  
    const matchData = {
        userId: userId2,
        timestamp: timestamp,
        status: 'active' as const
    };
    
    const matchData2 = {
        userId: userId1,
        timestamp: timestamp,
        status: 'active' as const
    };
    
    batch.update(db.collection('users').doc(userId1), {
        'stats.conversationsStarted': admin.firestore.FieldValue.increment(1),
        [`matches.${matchRef.id}`]: matchData
    });

    batch.update(db.collection('users').doc(userId2), {
        'stats.conversationsStarted': admin.firestore.FieldValue.increment(1),
        [`matches.${matchRef.id}`]: matchData2
    });
    
    await batch.commit();
    return matchRef.id;
}
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

if (!admin.apps.length) {
    admin.initializeApp();
    console.log("Firebase Admin initialized");
}

const OPENAI_API_KEY = 'sk-svcacct-B8xs6K8nBAJSV4vmKphNkJOaQb_FXd9CO-4R-eTHkKG3HsBi7Zfe4DFzZ3tK_eE7T3BlbkFJ2VF_wXPVcjX1TkLRzBz1PEGL75fTosNfao6y-QIbiOJ-m9M_p1UFGsZAePx_K_QA'; // Replace with your actual OpenAI API key
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
    questionnaire: {
        interests: string[];
        personalityTraits: string[];
        preferences: any;
        onboarding: {
            responses: {
                aspirations: { answer: string; updatedAt: null };
                entertainment: { answer: string; updatedAt: null };
                hobbies: { answer: string; updatedAt: null };
                location: { answer: string; updatedAt: null };
                music: { answer: string; updatedAt: null };
                travel: { answer: string; updatedAt: null };
            };
            status: {
                completedAt: Timestamp;
                isComplete: boolean;
                lastUpdated: Timestamp;
            };
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
  serviceAccount: 'firebase-adminsdk-xpi2x@nufriends-1aba1.iam.gserviceaccount.com'  // Add this
}, async (request) => {
  try {
      console.log("------- Starting findMatch Function -------");
      console.log("Service Account:", 'firebase-adminsdk-xpi2x@nufriends-1aba1.iam.gserviceaccount.com');

      const { userId } = request.data;
      console.log("Step 1: Received request for userId:", userId);
      
      const userRef = db.collection('users').doc(userId);
      console.log("Step 2: Attempting to fetch user document");
      const userDoc = await userRef.get();
      console.log("Raw document data:", userDoc.data());  // First new log here

      const userData = userDoc.data() as UserProfile;

      console.log("DEBUG - Full user data:", {
        hasOnboarding: Boolean(userData.questionnaire?.onboarding),
        fullOnboarding: userData.questionnaire?.onboarding,
        fullStatus: userData.questionnaire?.onboarding?.status,
        rawIsComplete: userData.questionnaire?.onboarding?.status?.isComplete
    });
    
    if (!userData) {
        console.error("Step 2 Error: User data not found for ID:", userId);
        throw new HttpsError('not-found', 'User profile not found');
    }
    
    console.log("Step 2 Success: Found user data with profile:", {
        userId,
        username: userData.username,
        age: userData.demographics?.age,
        isComplete: userData.questionnaire?.onboarding?.status?.isComplete
    });
    
    console.log("Step 3: Getting potential matches");
    const potentialMatches = await getPotentialMatches(userId, userData.demographics.age);
    console.log("Step 3 Result: Found potential matches:", {
        count: potentialMatches.length,
        ageRange: getAgeRange(userData.demographics.age)
    });
    
    if (potentialMatches.length === 0) {
        console.log("DEBUG: No matches found. Checking conditions:", {
            userAge: userData.demographics.age,
            ageRange: getAgeRange(userData.demographics.age),
            hasOnboarding: userData.questionnaire?.onboarding?.status?.isComplete
        });
        
        // Then throw the error with more context
        throw new HttpsError('failed-precondition', 
            'No potential matches available. Please try again later.');
    }

    let match: MatchResponse | undefined;

    console.log("Step 4: Starting GPT matching process");
    try {
        match = await findMatchWithGPT(userData, potentialMatches as UserProfile[]);
        console.log("Step 4 Success:", {
            matchUserId: match?.match?.userId,
            score: match?.match?.compatibilityScore
        });
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Unknown error in GPT matching');
        console.error("Step 4 Error:", {
            message: err.message,
            stack: err.stack
        });
        throw new HttpsError('internal', `GPT matching failed: ${err.message}`);
    }

      if (!match || !match.match) {
          console.error("Step 5 Error: No valid match found after GPT processing");
          throw new HttpsError('internal', 'No valid match found');
      }

      console.log("Step 5: Calculating match scores");
      const lastMatchTimestamp = userData.matches ? 
          Math.max(...Object.values(userData.matches).map(m => m.timestamp)) :
          0;

      const hoursSinceLastMatch = lastMatchTimestamp ? 
          (Date.now() - lastMatchTimestamp) / (1000 * 60 * 60) :
          48;

      const waitingScore = calculateWaitingScore(hoursSinceLastMatch);
      const finalScore = (match.match.compatibilityScore * 0.7) + (waitingScore * 0.3);
      const currentMatchCount = userData.matches ? Object.keys(userData.matches).length : 0;

      console.log("Step 5 Result:", {
          waitingScore,
          compatibilityScore: match.match.compatibilityScore,
          finalScore,
          currentMatchCount
      });

      console.log("Step 6: Recording match in database");
      const matchId = await recordMatch(userId, match.match.userId, {
          compatibilityScore: match.match.compatibilityScore,
          waitingScore,
          finalScore,
          matchNumber: currentMatchCount + 1,
          isInitialMatch: currentMatchCount < 5
      });
      console.log("Step 6 Success: Match recorded with ID:", matchId);

      console.log("Step 7: Returning match results");
      return {
          matchId,
          userId: match.match.userId,
          scores: {
              compatibility: match.match.compatibilityScore,
              waiting: waitingScore,
              final: finalScore
          }
      };
  } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error in findMatch');
      console.error("Final Error in findMatch:", {
          message: err.message,
          stack: err.stack,
          code: error instanceof HttpsError ? error.code : 'unknown'
      });
      if (error instanceof HttpsError) {
          throw error;
      }
      throw new HttpsError('internal', `Error processing friend match: ${err.message}`);
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
    const { responses } = user.questionnaire.onboarding;
    return {
        userId: user.uid,
        username: user.username,
        demographics: user.demographics,
        interests: {
            creative: responses.hobbies?.answer,
            lifestyle: responses.location?.answer,
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
    
    console.log("Finding matches for:", {
        userId,
        userAge,
        ageRange: { minAge, maxAge }
    });

    const eligibleMatches = await usersRef
    .where('demographics.age', '>=', minAge)
    .where('demographics.age', '<=', maxAge)
    .where('questionnaire.onboarding.status.isComplete', '==', true)
    .where(admin.firestore.FieldPath.documentId(), '!=', userId)
    .get();
  
    console.log("Query results:", {
        totalEligible: eligibleMatches.size,
        matches: eligibleMatches.docs.map(doc => ({
            id: doc.id,
            age: doc.data().demographics?.age,
            isComplete: doc.data().onboarding?.status?.isComplete
        }))
    });

    let potentialMatches = eligibleMatches.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    } as UserProfile));

    if (potentialMatches.length > 20) {
        potentialMatches = shuffleArray(potentialMatches).slice(0, 20);
    }
  
    return potentialMatches;
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
   - Travel and life experiences
   - Personal goals and growth areas

2. Look for matches that have:
   - Strong common ground
   - Complementary differences

Return only a JSON object:
{
  "match": {
    "userId": "string",
    "compatibilityScore": number
  }
}`;
}

async function findMatchWithGPT(userProfile: UserProfile, potentialMatches: UserProfile[]): Promise<MatchResponse> {
    try {
        console.log("Starting findMatchWithGPT function");
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        
        const prompt = await generateMatchPrompt(userProfile, potentialMatches);
        console.log("Prompt generated with length:", prompt.length);

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at analyzing profiles and finding meaningful friendship matches. Return ONLY valid JSON in the exact format specified.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 200
        });

        const responseContent = completion.choices[0].message.content;
        console.log("Raw GPT response:", responseContent);

        if (!responseContent) {
            throw new Error('Empty response from GPT');
        }

        try {
            const match = JSON.parse(responseContent);
            
            // Validate response structure
            if (!match.match?.userId || typeof match.match.compatibilityScore !== 'number') {
                throw new Error('Invalid response structure from GPT');
            }

            // Check minimum compatibility
            if (match.match.compatibilityScore < MINIMUM_COMPATIBILITY) {
                console.log("Match below minimum compatibility score, searching for alternative");
                const newPotentialMatches = potentialMatches.filter(p => p.uid !== match.match.userId);
                if (newPotentialMatches.length > 0) {
                    return findMatchWithGPT(userProfile, newPotentialMatches);
                }
            }

            return match;
        } catch (parseError: unknown) {
            console.error("GPT Response parsing failed:", {
                response: responseContent,
                error: parseError instanceof Error ? parseError.message : 'Unknown error'
            });
            throw parseError;
        }
    } catch (error) {
        console.error("findMatchWithGPT error:", {
            type: error instanceof Error ? error.constructor.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
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
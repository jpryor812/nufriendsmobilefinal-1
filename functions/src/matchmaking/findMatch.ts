import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const MINIMUM_COMPATIBILITY = 65;

interface UserProfile {
  id: string;
  demographics: {
    age: number;
  };
  onboarding: {
    responses: {
      [key: string]: {
        answer: string;
        updatedAt: number | null;
      };
    };
  };
  lastMatchTimestamp: number;
  matchCount: number;
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

// Age range helper
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

// Waiting score calculation
function calculateWaitingScore(hoursSinceLastMatch: number): number {
  if (hoursSinceLastMatch <= 24) return 0;
  
  const hoursOverMinimum = hoursSinceLastMatch - 24;
  const exponentialScore = Math.min(
    Math.pow(hoursOverMinimum / 13, 2.7) * 100,
    100
  );

  return exponentialScore;
}

// Profile preparation for GPT
function prepareProfileForGPT(user: UserProfile) {
  const { responses } = user.onboarding;
  return {
    userId: user.id,
    age: user.demographics.age,
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

// Get potential matches
async function getPotentialMatches(userId: string, userAge: number) {
  const { minAge, maxAge } = getAgeRange(userAge);
  const usersRef = db.collection('users');

  const eligibleMatches = await usersRef
    .where('demographics.age', '>=', minAge)
    .where('demographics.age', '<=', maxAge)
    .where(admin.firestore.FieldPath.documentId(), '!=', userId)
    .where('lastMatchTimestamp', '<', Date.now() - (24 * 60 * 60 * 1000))
    .get();

  let potentialMatches = eligibleMatches.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Limit to 40 users
  if (potentialMatches.length > 40) {
    potentialMatches = shuffleArray(potentialMatches).slice(0, 40);
  }

  return potentialMatches;
}

// GPT matching functions
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
  const prompt = `Analyze these profiles and find the most compatible friend match.

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

  return prompt;
}

async function findMatchWithGPT(
    userProfile: UserProfile, 
    potentialMatches: UserProfile[]
  ): Promise<MatchResponse> {
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

  // Check minimum compatibility
  if (match.compatibilityScore < MINIMUM_COMPATIBILITY) {
    const hoursSinceLastMatch = (Date.now() - userProfile.lastMatchTimestamp) / (1000 * 60 * 60);
    
    if (hoursSinceLastMatch > 46) {
      return match;
    }

    const newPotentialMatches = potentialMatches.filter(p => p.id !== match.match.userId);
    
    if (newPotentialMatches.length > 0) {
      return findMatchWithGPT(userProfile, newPotentialMatches);
    }
  }

  return match;
}
// Record match in database
interface MatchResponse {
    match: {
      userId: string;
      compatibilityScore: number;
    };
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
  
    // Update both users
    const user1Ref = db.collection('users').doc(userId1);
    const user2Ref = db.collection('users').doc(userId2);
  
    batch.update(user1Ref, {
      matchCount: admin.firestore.FieldValue.increment(1),
      lastMatchTimestamp: timestamp,
      matches: admin.firestore.FieldValue.arrayUnion({
        matchId: matchRef.id,
        userId: userId2,
        timestamp
      })
    });
  
    batch.update(user2Ref, {
      matchCount: admin.firestore.FieldValue.increment(1),
      lastMatchTimestamp: timestamp,
      matches: admin.firestore.FieldValue.arrayUnion({
        matchId: matchRef.id,
        userId: userId1,
        timestamp
      })
    });
  
    await batch.commit();
    return matchRef.id;
  }
  
  export const findMatch = onCall(
    { 
      memory: "1GiB",
      timeoutSeconds: 300
    }, 
    async (request) => {  // We use 'request' instead of separate data/context
      try {
        if (!request.auth) {  // Use request.auth instead of context.auth
          throw new HttpsError(  // Use HttpsError directly, not functions.https.HttpsError
            'unauthenticated',
            'Must be authenticated to use this function'
          );
        }
  
        const { userId } = request.data; 
      
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data() as UserProfile;
        if (!userData) {
          throw new HttpsError(  // Changed from functions.https.HttpsError
            'not-found',
            'User profile not found'
          );
        }
  
      const potentialMatches = await getPotentialMatches(userId, userData.demographics.age);
  
      let attempts = 0;
      const maxAttempts = 3;
      let match: MatchResponse | undefined;
  
      while (attempts < maxAttempts) {
        try {
            match = await findMatchWithGPT(userData, potentialMatches as UserProfile[]);
            break;
        } catch (error) {
          attempts++;
          if (attempts === maxAttempts) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
  
      if (!match || !match.match) {
        throw new HttpsError(  // Changed from functions.https.HttpsError
          'internal',
          'No valid match found'
        );
      }
  
      const hoursSinceLastMatch = (Date.now() - userData.lastMatchTimestamp) / (1000 * 60 * 60);
      const waitingScore = calculateWaitingScore(hoursSinceLastMatch);
      const finalScore = (match.match.compatibilityScore * 0.7) + (waitingScore * 0.3);
  
      const matchId = await recordMatch(userId, match.match.userId, {
        compatibilityScore: match.match.compatibilityScore,
        waitingScore,
        finalScore,
        matchNumber: userData.matchCount + 1,
        isInitialMatch: userData.matchCount < 5
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
        throw new HttpsError(  // Changed from functions.https.HttpsError
          'internal',
          'Error processing friend match',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    });
  
  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
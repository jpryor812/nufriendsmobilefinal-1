import { onCall, HttpsError } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

const OPENAI_API_KEY = '***'; // Move to environment variables

interface UserResponses {
  aspirations: { answer: string };
  entertainment: { answer: string };
  hobbies: { answer: string };
  location: { answer: string };
  music: { answer: string };
  relationships: { answer: string };
  travel: { answer: string };
}

interface UserWithResponses {
  username: string;
  responses: UserResponses;
}

export const generateConversationContent = onCall({
  region: 'us-central1',
  memory: "1GiB",
  timeoutSeconds: 60,
  enforceAppCheck: false
}, async (request) => {
  try {
    console.log("------- Starting Conversation Generation -------");
    const { userId, matchedUserId, selectedTopic } = request.data;

    // Get both users' data
    const [userDoc, matchedUserDoc] = await Promise.all([
      admin.firestore().collection('users').doc(userId).get(),
      admin.firestore().collection('users').doc(matchedUserId).get()
    ]);

    if (!userDoc.exists || !matchedUserDoc.exists) {
      throw new HttpsError('not-found', 'One or both user profiles not found');
    }

    interface UserData {
      username: string;  
      questionnaire: {
          onboarding: {
            responses: {
              aspirations: { answer: string };
              entertainment: { answer: string };
              hobbies: { answer: string };
              location: { answer: string };
              music: { answer: string };
              relationships: { answer: string };
              travel: { answer: string };
            };
          };
        };
      }
      
      // Then in your function, add the type assertion
      const userData = userDoc.data() as UserData;
      const matchedUserData = matchedUserDoc.data() as UserData;

    // If no topic is selected, generate topics with GPT-3.5
    if (!selectedTopic) {
      // We already checked if docs exist above
      const topics = await generateTopics(
        {
          username: (userDoc.data() as UserData).username,
          responses: userData.questionnaire.onboarding.responses
        },
        {
          username: (matchedUserDoc.data() as UserData).username,
          responses: matchedUserData.questionnaire.onboarding.responses
        }
      );
      return { type: 'topics', content: topics };
    }

    // If topic is selected, generate message with GPT-4
    const message = await generateMessage(
      userData.questionnaire.onboarding.responses,
      matchedUserData.questionnaire.onboarding.responses,
      selectedTopic,
      (matchedUserDoc.data() as UserData).username
    );
    return { type: 'message', content: message };

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error("Error in generateConversationContent:", err.message);
    throw error instanceof HttpsError ? error : 
          new HttpsError('internal', `Error generating content: ${err.message}`);
  }
});

async function generateTopics(
  user: UserWithResponses,  // Current user who'll be sending messages
  matchedUser: UserWithResponses  // The friend they'll be talking to
): Promise<string[]> {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const prompt = `Generate 4 conversation starters for ${user.username} to use when talking with ${matchedUser.username}.

${matchedUser.username}'s PROFILE (the person being messaged):
${JSON.stringify(matchedUser.responses, null, 2)}

${user.username}'s PROFILE (the person sending messages):
${JSON.stringify(user.responses, null, 2)}

Return a JSON array of 4 conversation starters where:
- "You could ask ${matchedUser.username} about..." should be used for asking about THEIR interests
- "You could tell ${matchedUser.username} about..." should be used for sharing YOUR (${user.username}'s) experiences

Examples:
- If ${matchedUser.username} likes hiking: "You could ask ${matchedUser.username} about their favorite hiking trails"
- If ${user.username} likes reading: "You could tell ${matchedUser.username} about your favorite sci-fi books"

Keep each suggestion under 15 words and return as a raw JSON array (no formatting).`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at suggesting engaging conversation topics based on shared interests, or a question to get to know each other better. Return ONLY a JSON array of 4 strings. Never include markdown, backticks, or any formatting. Return only raw JSON arrays.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 256
    });

    const responseContent = completion.choices[0].message.content;
    console.log('Raw GPT response:', responseContent); // Debug log

    if (!responseContent) {
      throw new Error('Empty response from GPT');
    }
    try {
      // Aggressively clean the response
      const cleanedResponse = responseContent
        .trim()
        .replace(/```json\n?|\n?```/g, '')  // Remove code blocks
        .replace(/`/g, '')                   // Remove any remaining backticks
        .replace(/\n/g, ' ')                 // Remove newlines
        .trim();

      console.log('Cleaned response:', cleanedResponse); // Debug log
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Parse error with cleaned response:', parseError);
      throw new Error('Failed to parse GPT response into JSON');
    }
  } catch (error) {
    console.error("Error generating topics:", error);
    throw error;
  }
}


async function generateMessage(
  userResponses: UserResponses,
  matchedUserResponses: UserResponses,
  selectedTopic: string,
  matchedUsername: string 
): Promise<string> {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const prompt = `Write a natural first message to ${matchedUsername} based on this conversation topic: "${selectedTopic}"

Rules:
- Write as if you're directly messaging ${matchedUsername}
- Don't reference any third parties
- Start with a friendly greeting
- Include a specific question or comment about their interests
- Keep it under 200 characters
- Make it casual and conversational

GOOD EXAMPLES:
"Hey! I saw you're into Star Wars too - which movie in the series is your favorite? The original trilogy is classic!"
"Hi! I noticed you love hiking - have you explored any of the trails around Denver yet?"

BAD EXAMPLES:
"You should ask them about their favorite sci-fi shows"
"Hey! I heard you like the same shows as Alex_Tech"`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are writing direct messages between two people. Write ONLY the message text with no commentary or third-party references.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error("Error generating message:", error);
    throw error;
  }
}
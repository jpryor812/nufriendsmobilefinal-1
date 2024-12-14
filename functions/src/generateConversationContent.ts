import { onCall, HttpsError } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

const OPENAI_API_KEY = 'sk-svcacct-B8xs6K8nBAJSV4vmKphNkJOaQb_FXd9CO-4R-eTHkKG3HsBi7Zfe4DFzZ3tK_eE7T3BlbkFJ2VF_wXPVcjX1TkLRzBz1PEGL75fTosNfao6y-QIbiOJ-m9M_p1UFGsZAePx_K_QA'; // Move to environment variables

interface UserResponses {
  aspirations: { answer: string };
  entertainment: { answer: string };
  hobbies: { answer: string };
  location: { answer: string };
  music: { answer: string };
  relationships: { answer: string };
  travel: { answer: string };
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
      const topics = await generateTopics(
        userData.questionnaire.onboarding.responses,
        matchedUserData.questionnaire.onboarding.responses
      );
      return { type: 'topics', content: topics };
    }

    // If topic is selected, generate message with GPT-4
    const message = await generateMessage(
      userData.questionnaire.onboarding.responses,
      matchedUserData.questionnaire.onboarding.responses,
      selectedTopic
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
  userResponses: UserResponses,
  matchedUserResponses: UserResponses
): Promise<string[]> {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const prompt = `Analyze these two users' responses and suggest 5 specific conversation topics they might connect over.

USER 1 RESPONSES:
${JSON.stringify(userResponses, null, 2)}

USER 2 RESPONSES:
${JSON.stringify(matchedUserResponses, null, 2)}

Return only a JSON array of 4 conversation topic suggestions.
Each topic should be specific and based on their shared interests or experiences, or a question to get to know each other better.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at suggesting engaging conversation topics based on shared interests, or a question to get to know each other better. Return ONLY a JSON array of 4 strings.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 256
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('Empty response from GPT');
    }

    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating topics:", error);
    throw error;
  }
}

async function generateMessage(
  userResponses: UserResponses,
  matchedUserResponses: UserResponses,
  selectedTopic: string
): Promise<string> {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const prompt = `Create a natural, friendly first message in a conversation (maximum 200 characters) about: "${selectedTopic}"

Based on these profiles:
USER 1: ${JSON.stringify(userResponses, null, 2)}
USER 2: ${JSON.stringify(matchedUserResponses, null, 2)}

Return only the message text. Keep it casual and under 200 characters.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at crafting friendly, natural conversation starters. Return ONLY the message text.'
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
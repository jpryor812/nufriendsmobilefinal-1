import { onCall, HttpsError } from 'firebase-functions/v2/https';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

const OPENAI_API_KEY = 'sk-svcacct-B8xs6K8nBAJSV4vmKphNkJOaQb_FXd9CO-4R-eTHkKG3HsBi7Zfe4DFzZ3tK_eE7T3BlbkFJ2VF_wXPVcjX1TkLRzBz1PEGL75fTosNfao6y-QIbiOJ-m9M_p1UFGsZAePx_K_QA'; // Replace with your actual OpenAI API key
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const db = admin.firestore();

interface UserProfile {
    uid: string;
    username: string;
    questionnaire: {
        onboarding: {
            responses: {
                aspirations: { answer: string };
                entertainment: { answer: string };
                hobbies: { answer: string };
                location: { answer: string };
                music: { answer: string };
                travel: { answer: string };
            };
        };
    };
}

interface Message {
    content: string;
    senderId: string;
    timestamp: admin.firestore.Timestamp;
    type: 'initial_conversation';
    read: boolean;
}

export const generateInitialConversation = onCall({
    region: 'us-central1',
    memory: "1GiB",
}, async (request) => {
    try {
        const { matchId } = request.data;
        
        // Get match document
        const matchDoc = await db.collection('matches').doc(matchId).get();
        if (!matchDoc.exists) {
            throw new HttpsError('not-found', 'Match not found');
        }
        
        const matchData = matchDoc.data();
        if (!matchData || !matchData.users || !Array.isArray(matchData.users)) {
            throw new HttpsError('failed-precondition', 'Invalid match data');
        }

        const [user1Id, user2Id] = matchData.users;
        
        // Get both users' profiles
        const [user1Doc, user2Doc] = await Promise.all([
            db.collection('users').doc(user1Id).get(),
            db.collection('users').doc(user2Id).get()
        ]);
        
        const user1Data = user1Doc.data() as UserProfile;
        const user2Data = user2Doc.data() as UserProfile;

        // Generate conversation prompt based on user profiles
        const prompt = generateConversationPrompt(user1Data, user2Data);
        
        // Get GPT response
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at generating natural, friendly conversations between two people who have just matched based on shared interests. Do not assume anything about the user that they do not mention in their responses to the onboarding questions. Generate 6 messages total (3 from each person) that feel authentic and reference their specific interests and backgrounds. The conversation should be warm and engaging but not overly familiar or pushy. A simple introductory conversation. Each message must be less than 150 characters.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.9,
            max_tokens: 1000
        });

        // Parse GPT response into messages
        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new HttpsError('internal', 'Failed to generate conversation content');
        }

        // Parse GPT response into messages
        const conversation = parseGPTResponse(content);
        
        // Create conversation document
        const conversationRef = db.collection('conversations').doc(matchId);
        await conversationRef.set({
            participants: [user1Id, user2Id],
            createdAt: admin.firestore.Timestamp.now(),
            lastMessage: conversation[conversation.length - 1].content,
            lastMessageTimestamp: admin.firestore.Timestamp.now(),
            matchId
        });

        // Add messages to conversation
        const batch = db.batch();
        conversation.forEach((message, index) => {
            const messageRef = conversationRef.collection('messages').doc();
            const messageData: Message = {
                content: message.content,
                senderId: message.senderId === 'user1' ? user1Id : user2Id,
                timestamp: admin.firestore.Timestamp.fromMillis(Date.now() + (index * 1000)), // Space messages 1 second apart
                type: 'initial_conversation',
                read: false
            };
            batch.set(messageRef, messageData);
        });

        await batch.commit();

        return { success: true, conversationId: conversationRef.id };
    } catch (error) {
        console.error('Error generating conversation:', error);
        throw new HttpsError('internal', 'Failed to generate conversation');
    }
});

function generateConversationPrompt(user1: UserProfile, user2: UserProfile): string {
    return `Generate a natural conversation between two people who just matched based on shared interests.

User 1 (${user1.username}):
${JSON.stringify(user1.questionnaire.onboarding.responses, null, 2)}

User 2 (${user2.username}):
${JSON.stringify(user2.questionnaire.onboarding.responses, null, 2)}

Generate 6 messages that form a natural conversation between these users, with 3 messages from each person. 
Format the response exactly like this example:
[
    {"senderId": "user1", "content": "message text"},
    {"senderId": "user2", "content": "message text"},
    ...
]`;
}

function parseGPTResponse(response: string): Array<{ senderId: string, content: string }> {
    try {
        const match = response.match(/\[[\s\S]*\]/);
        if (!match) {
            throw new Error('No valid JSON array found in response');
        }
        
        const messages = JSON.parse(match[0]);
        if (!Array.isArray(messages) || messages.length !== 6) {
            throw new Error('Invalid message format or count');
        }

        // Validate message lengths
        messages.forEach((message, index) => {
            if (message.content.length > 150) {
                throw new Error(`Message ${index + 1} exceeds 150 characters`);
            }
        });
        
        return messages;
    } catch (error) {
        console.error('Error parsing GPT response:', error);
        throw error;
    }
}
import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

// Initialize OpenAI with environment variable
const OPENAI_API_KEY = 'sk-svcacct-B8xs6K8nBAJSV4vmKphNkJOaQb_FXd9CO-4R-eTHkKG3HsBi7Zfe4DFzZ3tK_eE7T3BlbkFJ2VF_wXPVcjX1TkLRzBz1PEGL75fTosNfao6y-QIbiOJ-m9M_p1UFGsZAePx_K_QA'; // Move to environment variables
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });// Replace with env variable in production

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateProfileSummaries(responses: any) {
    const prompt = `Summarize each response in 1-8 words:

Location: "${responses.location.answer}"
Hobbies: "${responses.hobbies.answer}"
Music: "${responses.music.answer}"
Entertainment: "${responses.entertainment.answer}"
Travel: "${responses.travel.answer}"
Goals: "${responses.aspirations.answer}"

Return ONLY a JSON object in this exact format:
{
    "location": "brief summary",
    "hobbies": "brief summary",
    "music": "brief summary",
    "entertainment": "brief summary",
    "travel": "brief summary",
    "goals": "brief summary"
}`;

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a profile summarizer. Create concise, accurate summaries.'
            },
            { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200
    });

    const summaryContent = completion.choices[0].message.content;
    if (!summaryContent) {
        throw new Error('No content received from OpenAI');
    }
    return {
        ...JSON.parse(summaryContent),
        isVisible: true
    };
}

export const generateAllUserSummaries = onCall({ 
    region: 'us-central1',
    memory: "1GiB",
    timeoutSeconds: 300,
    enforceAppCheck: false,
}, async (request) => {
    const startTime = Date.now();
    console.log('Starting bulk update process');

    try {
        const db = admin.firestore();
        
        // Get all users
        const usersSnapshot = await db.collection('users').get();
        let processedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        
        // Create a batch
        let batch = db.batch();
        let batchCount = 0;
        const BATCH_SIZE = 500;

        // Process each user
        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            console.log('Processing user:', {
                id: doc.id,
                hasQuestionnaire: !!userData.questionnaire,
                hasOnboarding: !!userData.questionnaire?.onboarding,
                hasResponses: !!userData.questionnaire?.onboarding?.responses,
                existingSummaries: !!userData.profileSummaries
            });

            // Validate user has required data
            if (!userData.questionnaire?.onboarding?.responses) {
                console.log(`Skipping user ${doc.id}: Missing data structure:`, {
                    questionnaire: !!userData.questionnaire,
                    onboarding: !!userData.questionnaire?.onboarding,
                    responses: !!userData.questionnaire?.onboarding?.responses
                });
                skippedCount++;
                continue;
            }

            // Log the actual responses
            console.log('User responses:', userData.questionnaire.onboarding.responses);

            try {
                console.log(`Processing user: ${userData.email || doc.id}`);
                const summaries = await generateProfileSummaries(userData.questionnaire.onboarding.responses);
                
                if (!summaries) {
                    throw new Error('No summaries generated');
                }

                // Add to batch update
                batch.update(doc.ref, {
                    profileSummaries: summaries
                });
                
                batchCount++;
                processedCount++;

                // If we reach batch size limit, commit and create new batch
                if (batchCount === BATCH_SIZE) {
                    await batch.commit();
                    batch = db.batch();
                    batchCount = 0;
                    console.log(`Committed batch of ${BATCH_SIZE} updates`);
                }

                // Add delay between OpenAI calls to avoid rate limits
                await delay(200);

            } catch (error: unknown) {
                console.error(`Error processing user ${userData.email || doc.id}:`, error);
                errorCount++;
                // Store the error in Firestore
                batch.update(doc.ref, {
                    profileSummariesError: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        // Commit any remaining updates
        if (batchCount > 0) {
            await batch.commit();
            console.log(`Committed final batch of ${batchCount} updates`);
        }

        const summary = {
            totalUsers: usersSnapshot.size,
            processed: processedCount,
            skipped: skippedCount,
            errors: errorCount,
            timeElapsed: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
        };

        console.log('Update complete:', summary);
        return summary;

    } catch (error) {
        console.error('Error updating users:', error);
        throw new Error('Failed to update user summaries');
    }
});
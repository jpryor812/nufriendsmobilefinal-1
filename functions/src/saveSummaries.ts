import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const saveSummaries = onCall({ 
    region: 'us-central1',
    memory: "1GiB",
    timeoutSeconds: 300,
    enforceAppCheck: false,
}, async (request) => {
    try {
        const { userId, summaries, hiddenItems } = request.data;
        if (!userId) return;

        const hiddenSet = new Set(hiddenItems);

        const visibleSummaries = {
            entertainment: !hiddenSet.has('entertainment') ? summaries.entertainment : null,
            goals: !hiddenSet.has('goals') ? summaries.goals : null,
            hobbies: !hiddenSet.has('hobbies') ? summaries.hobbies : null,
            location: !hiddenSet.has('location') ? summaries.location : null,
            music: !hiddenSet.has('music') ? summaries.music : null,
            travel: !hiddenSet.has('travel') ? summaries.travel : null,
            isVisible: true
        };

        await admin.firestore().collection('users').doc(userId).update({
            profileSummaries: visibleSummaries
        });

        return { success: true };  // Add a return value

    } catch (error) {
        console.error('Error saving summaries:', error);
        throw error;
    }
});
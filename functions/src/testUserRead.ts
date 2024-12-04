import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// Only initialize if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

export const testUserRead = onCall({
    region: 'us-central1'
}, async (request) => {
    try {
        // Check if we have auth
        if (!request.auth) {
            throw new Error('Not authenticated');
        }

        console.log('Auth type:', request.auth.token.firebase.sign_in_provider);
        console.log('User ID:', request.auth.uid);

        const userDoc = await admin.firestore()
            .collection('users')
            .doc(request.auth.uid)
            .get();

        return {
            exists: userDoc.exists,
            data: userDoc.exists ? userDoc.data() : null,
            auth: request.auth.token
        };
    } catch (error) {
        console.error('Detailed error:', error);
        throw error;
    }
});
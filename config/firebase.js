import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

<<<<<<< HEAD
// Import environment variables
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};
=======
const firebaseConfig = {
        apiKey: "AIzaSyChgR0wpjD5xXT3qR7vzmT32wOGyD6P2D4",
        authDomain: "nufriends-1aba1.firebaseapp.com",
        projectId: "nufriends-1aba1",
        storageBucket: "nufriends-1aba1.firebasestorage.app",
        messagingSenderId: "792301576889",
        appId: "1:792301576889:web:ebc7dd6c1ecdbef1d53168",
        measurementId: "G-8BT008HJ2Y"
      };

>>>>>>> restore-point2
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
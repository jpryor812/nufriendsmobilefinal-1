// config/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBJTMUZvVdAihlW6kJxg6fOevKZJveW_TM",
  authDomain: "nufriends-1aba1.firebaseapp.com",
  projectId: "nufriends-1aba1",
  storageBucket: "nufriends-1aba1.firebasestorage.app",
  messagingSenderId: "792301576889",
  appId: "1:792301576889:web:ebc7dd6c1ecdbef1d53168"
};

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
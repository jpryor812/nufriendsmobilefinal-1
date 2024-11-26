import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyChgR0wpjD5xXT3qR7vzmT32wOGyD6P2D4",
  authDomain: "nufriends-1aba1.firebaseapp.com",
  projectId: "nufriends-1aba1",
  storageBucket: "nufriends-1aba1.firebasestorage.app",
  messagingSenderId: "792301576889",
  appId: "1:792301576889:web:ebc7dd6c1ecdbef1d53168",
  measurementId: "G-8BT008HJ2Y"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize functions with explicit configuration
const functions = getFunctions(app, 'us-central1');  // Region in initialization


const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, functions };

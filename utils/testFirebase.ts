import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
export const auth = getAuth(app);
export const db = getFirestore(app);
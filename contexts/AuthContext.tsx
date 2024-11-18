import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '@/config/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Define types
interface UserData {
  uid: string;
  email: string | null;
  username: string;
  createdAt: Date;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUserAccount: (password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting signup process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Auth with UID:', user.uid);

      // Create user document
      console.log('Attempting to create Firestore document...');
      const userDocRef = doc(db, 'users', user.uid);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        username,
        createdAt: serverTimestamp(),
        questionnaire: {
          interests: [],
          preferences: {},
          personalityTraits: []
        },
        stats: {
          messagesSent: 0,
          conversationsStarted: 0,
          aiInteractions: 0
        },
        subscription: {
          type: 'free',
          validUntil: null
        },
        avatar: {
          currentOutfit: {},
          unlockedItems: ['basic_outfit']
        }
      };

      console.log('User data to be stored:', userData);
      await setDoc(userDocRef, userData);
      console.log('Firestore document created successfully');

      // Verify the document was created
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        console.log('Verified document data:', docSnap.data());
      } else {
        console.log('Document was not created successfully');
      }

    } catch (error) {
      console.error('Error in signup process:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) throw new Error('No user logged in');
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      let errorMessage = 'Failed to update password';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      }
      throw new Error(errorMessage);
    }
  };

  const deleteUserAccount = async (password: string) => {
    try {
      if (!user || !user.email) throw new Error('No user logged in');
      
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user data from Firestore first
      await deleteDoc(doc(db, 'users', user.uid));
      
      // Delete the user account
      await deleteUser(user);
    } catch (error: any) {
      let errorMessage = 'Failed to delete account';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password is incorrect';
      }
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateUserPassword,
        deleteUserAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook with type safety
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
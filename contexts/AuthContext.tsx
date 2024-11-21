<<<<<<< HEAD
=======

>>>>>>> restore-point2
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
<<<<<<< HEAD
  deleteUser,
  getAuth,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, updateDoc, where} from 'firebase/firestore';
=======
  getAuth,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, where } from 'firebase/firestore';
>>>>>>> restore-point2


// Define types
interface UserData {
  uid: string;
  email: string | null;
  username: string;
  createdAt: Date;
  demographics: {
    age: number;
<<<<<<< HEAD
    birthDate: string; 
=======
    birthDate: number; 
>>>>>>> restore-point2
    gender: string;
    state: string;
    city: string;
  };
  questionnaire: {
    interests: string[];
    preferences: Record<string, any>;
    personalityTraits: string[];
  };
  stats: {
    messagesSent: number;
    conversationsStarted: number;
    aiInteractions: number;
  };
  subscription: {
    type: string;
    validUntil: null | Date;
  };
  avatar: {
    currentOutfit: Record<string, any>;
    unlockedItems: string[];
  };
}

type UserWithData = FirebaseUser & {
  userData?: UserData;
};

interface AuthContextType {
<<<<<<< HEAD
  user: UserWithData | null; 
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteUserAccount: (email: string, password: string) => Promise<void>;
  // Update this line to include birthDate parameter
  updateDemographics: (
    age: number, 
    gender: string, 
    state: string, 
    city: string,
    birthDate: string
  ) => Promise<void>;
  updateProfile: (updates: {
    username?: string,
    city?: string,
    state?: string
    age?: number
    birthDate?: string  
  }) => Promise<void>;
}
=======
    user: UserWithData | null; 
    loading: boolean;
    signup: (email: string, password: string, username: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
    updateDemographics: (
      age: number, 
      gender: string, 
      state: string, 
      city: string,
      birthDate: number  // Changed from string to number
    ) => Promise<void>;
    updateProfile: (updates: {
      username?: string,
      city?: string,
      state?: string
      age?: number
      birthDate?: number  // Changed from string to number
    }) => Promise<void>;
  }
>>>>>>> restore-point2

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data() as UserData;
        
        // Combine Firebase user with Firestore data
        setUser({
          ...firebaseUser,
          userData: userData
        });
      } else {
        setUser(null);
      }
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
        demographics: {  
<<<<<<< HEAD
          age: 0,  
=======
          age: 0,
          birthDate: 0,  
>>>>>>> restore-point2
          gender: '',
          state: '',
          city: ''
        },
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

<<<<<<< HEAD
  const deleteUserAccount = async (password: string): Promise<void> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error('No user logged in');
  
      // Create credential with email and password
      const credential = EmailAuthProvider.credential(currentUser.email, password);
  
      // Reauthenticate user
      await reauthenticateWithCredential(currentUser, credential);
  
      // Delete user
      await deleteUser(currentUser);
  
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid));
  
      console.log('Account deleted successfully');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      if (err.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (err.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again before deleting your account.');
      } else {
        throw new Error(err.message);
      }
    }
  };

=======
>>>>>>> restore-point2
  const updateDemographics = async (
    age: number, 
    gender: string, 
    state: string, 
    city: string,
<<<<<<< HEAD
    birthDate: string
=======
    birthDate: number
>>>>>>> restore-point2
  ) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'demographics.age': age,
        'demographics.gender': gender,
        'demographics.state': state,
        'demographics.city': city,
        'demographics.birthDate': birthDate
      });
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: {
    username?: string,
    city?: string,
    state?: string
    age?: number
<<<<<<< HEAD
    birthDate?: string  // Add this
=======
    birthDate?: number  // Add this
>>>>>>> restore-point2
  }) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updateData: any = {};
      if (updates.username) updateData.username = updates.username;
      if (updates.city) updateData['demographics.city'] = updates.city;
      if (updates.state) updateData['demographics.state'] = updates.state;
      if (updates.age) updateData['demographics.age'] = updates.age;
      if (updates.birthDate) updateData['demographics.birthDate'] = updates.birthDate;
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updateData);
    } catch (error) {
      throw error;
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
<<<<<<< HEAD
        deleteUserAccount,
=======
>>>>>>> restore-point2
        updateDemographics,
        updateProfile,
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
<<<<<<< HEAD
}
=======
}
>>>>>>> restore-point2

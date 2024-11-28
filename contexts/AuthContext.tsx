import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '@/config/firebase';
import { 
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  getAuth,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  updateDoc, 
  where, 
  collection, 
  query, 
  getDocs,
  Timestamp, 
} from 'firebase/firestore';

interface OnboardingResponse {
    answer: string;
    updatedAt: Date | null;
  }
  
  interface OnboardingResponses {
    location: OnboardingResponse;
    hobbies: OnboardingResponse;
    relationships: OnboardingResponse;
    music: OnboardingResponse;
    entertainment: OnboardingResponse;
    travel: OnboardingResponse;
    aspirations: OnboardingResponse;
  }
  
  interface UserData {
    uid: string;
    storedEmail: string;
    storedPassword: string;
    username: string;
    createdAt: Date;
    authType: string;
    lastLogin: Date;
    demographics: {
      age: number;
      birthDate: number; 
      gender: string;
      state: string;
      city: string;
    };
    questionnaire: {
      interests: string[];
      preferences: Record<string, any>;
      personalityTraits: string[];
      onboarding: {
        responses: OnboardingResponses;
        status: {
          isComplete: boolean;
          lastUpdated: Date | null;
          completedAt: Date | null;
        };
      };
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
      birthDate: number  
    ) => Promise<void>;
    updateProfile: (updates: {
      username?: string,
      city?: string,
      state?: string
      age?: number
      birthDate?: number  // Changed from string to number
    }) => Promise<void>;
    updateOnboardingResponse: (
      questionId: keyof OnboardingResponses,  // Now matches the implementation
      answer: string
  ) => Promise<void>;
      getOnboardingStatus: () => Promise<{
        isComplete: boolean;
        completedResponses: string[];
      }>;
  }

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingProgress, setOnboardingProgress] = useState<{ isComplete: boolean; firstUnanswered: string | null } | null>(null);

  // Helper function to create initial user data
  const createInitialUserData = (uid: string): UserData => {
    const emptyResponse: OnboardingResponse = {
      answer: '',
      updatedAt: null
    };
    
    return {
      uid,
      storedEmail: '',
      storedPassword: '',
      username: `User_${uid.slice(0, 6)}`,
      createdAt: new Date(),
      authType: 'anonymous',
      lastLogin: new Date(),
      demographics: {
        age: 0,
        birthDate: 0,
        gender: '',
        state: '',
        city: ''
      },
      questionnaire: {
        interests: [],
        preferences: {},
        personalityTraits: [],
        onboarding: {
          responses: {
            location: emptyResponse,
            hobbies: emptyResponse,
            relationships: emptyResponse,
            music: emptyResponse,
            entertainment: emptyResponse,
            travel: emptyResponse,
            aspirations: emptyResponse
          },
          status: {
            isComplete: false,
            lastUpdated: null,
            completedAt: null
          }
        }
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
  };

  // Helper function to handle Firestore user data
  async function handleUserData(firebaseUser: FirebaseUser) {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const initialUserData = createInitialUserData(firebaseUser.uid);
      const firestoreData = {
        ...initialUserData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      try {
        await setDoc(userDocRef, firestoreData);
        setUser({
          ...firebaseUser,
          userData: initialUserData
        });
        setOnboardingProgress({
          isComplete: false,
          firstUnanswered: 'location',
        });
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      const firestoreData = userDoc.data();
      const userData: UserData = {
        uid: firestoreData.uid,
        storedEmail: firestoreData.storedEmail,
        storedPassword: firestoreData.storedPassword,
        username: firestoreData.username,
        createdAt: firestoreData.createdAt.toDate(),
        lastLogin: firestoreData.lastLogin.toDate(),
        authType: firestoreData.authType,
        demographics: firestoreData.demographics,
        questionnaire: {
            interests: firestoreData.questionnaire.interests,
            preferences: firestoreData.questionnaire.preferences,
            personalityTraits: firestoreData.questionnaire.personalityTraits,
            onboarding: {
                responses: firestoreData.questionnaire.onboarding.responses,
                status: {
                    isComplete: firestoreData.questionnaire.onboarding.status.isComplete,
                    lastUpdated: firestoreData.questionnaire.onboarding.status.lastUpdated?.toDate() || null,
                    completedAt: firestoreData.questionnaire.onboarding.status.completedAt?.toDate() || null
                }
            }
        },
        stats: firestoreData.stats,
        subscription: firestoreData.subscription,
        avatar: firestoreData.avatar
    };

      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });

      setUser({
        ...firebaseUser,
        userData
      });

      // Set onboarding progress
      const responses = userData.questionnaire.onboarding.responses;
      const questionOrder: (keyof OnboardingResponses)[] = [
        'location', 'hobbies', 'relationships', 'music',
        'entertainment', 'travel', 'aspirations'
      ];
      const firstUnanswered = questionOrder.find((q) => !responses[q]?.answer);
      
      setOnboardingProgress({
        isComplete: !firstUnanswered,
        firstUnanswered: firstUnanswered || null,
      });
    }
  }

  // Main auth state listener
  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth state listener');
  
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      if (!mounted) return;

      if (!firebaseUser) {
        try {
          console.log('No user found, creating anonymous user');
          const anonymousAuth = await signInAnonymously(auth);
          // Add this line to ensure auth is complete before continuing
          await handleUserData(anonymousAuth.user);
          console.log('Anonymous auth created:', anonymousAuth.user.uid);
          return;
        } catch (error) {
          console.error('Failed to sign in anonymously:', error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
      }

      try {
        console.log('Handling user data for:', firebaseUser.uid);
        await handleUserData(firebaseUser);
      } catch (error) {
        console.error('Error handling user data:', error);
        if (mounted) {
          setUser(null);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, username: string) => {
    try {
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('storedEmail', '==', email));
      const existingUser = await getDocs(emailQuery);
      
      if (!existingUser.empty) {
        throw new Error('Email already exists');
      }

      let currentUser = auth.currentUser;
      if (!currentUser) {
        const anonymousAuth = await signInAnonymously(auth);
        currentUser = anonymousAuth.user;
        console.log('Created new anonymous user:', currentUser.uid);
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const initialUserData = createInitialUserData(currentUser.uid);
      initialUserData.storedEmail = email;
      initialUserData.storedPassword = password;
      initialUserData.username = username;

      const firestoreData = {
        ...initialUserData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        authType: 'anonymous'
      };

      await setDoc(userDocRef, firestoreData);
      
      setUser({
        ...currentUser,
        userData: initialUserData
      });

      console.log('User document created successfully');

    } catch (error) {
      console.error('Error in signup process:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('storedEmail', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid email or password');
      }
  
      const userDoc = querySnapshot.docs[0];
      const firestoreData = userDoc.data();
  
      if (firestoreData.storedPassword !== password) {
        throw new Error('Invalid email or password');
      }

      let currentUser = auth.currentUser;
      if (!currentUser) {
        const anonymousAuth = await signInAnonymously(auth);
        currentUser = anonymousAuth.user;
      }

      // Update last login
      await updateDoc(doc(db, 'users', currentUser.uid), {
        lastLogin: serverTimestamp()
      });

      const userData: UserData = {
        uid: firestoreData.uid,
        storedEmail: firestoreData.storedEmail,
        storedPassword: firestoreData.storedPassword,
        username: firestoreData.username,
        createdAt: firestoreData.createdAt.toDate(),
        lastLogin: firestoreData.lastLogin.toDate(),
        authType: firestoreData.authType,
        demographics: firestoreData.demographics,
        questionnaire: {
            interests: firestoreData.questionnaire.interests,
            preferences: firestoreData.questionnaire.preferences,
            personalityTraits: firestoreData.questionnaire.personalityTraits,
            onboarding: {
                responses: firestoreData.questionnaire.onboarding.responses,
                status: {
                    isComplete: firestoreData.questionnaire.onboarding.status.isComplete,
                    lastUpdated: firestoreData.questionnaire.onboarding.status.lastUpdated?.toDate() || null,
                    completedAt: firestoreData.questionnaire.onboarding.status.completedAt?.toDate() || null
                }
            }
        },
        stats: firestoreData.stats,
        subscription: firestoreData.subscription,
        avatar: firestoreData.avatar
    };
  
      setUser({
        ...currentUser!,
        userData
      });
  
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
      }
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.storedPassword !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      await updateDoc(doc(db, 'users', user.uid), {
        storedPassword: newPassword,
        lastLogin: serverTimestamp()
      });

    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  };

  const updateDemographics = async (
    age: number, 
    gender: string, 
    state: string, 
    city: string,
    birthDate: number
  ) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'demographics.age': age,
        'demographics.gender': gender,
        'demographics.state': state,
        'demographics.city': city,
        'demographics.birthDate': birthDate,
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      console.error('Demographics update error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: {
    username?: string,
    city?: string,
    state?: string,
    age?: number,
    birthDate?: number
  }) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updateData: any = {
        lastLogin: serverTimestamp()
      };
      if (updates.username) updateData.username = updates.username;
      if (updates.city) updateData['demographics.city'] = updates.city;
      if (updates.state) updateData['demographics.state'] = updates.state;
      if (updates.age) updateData['demographics.age'] = updates.age;
      if (updates.birthDate) updateData['demographics.birthDate'] = updates.birthDate;
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const updateOnboardingResponse = async (
    questionId: keyof OnboardingResponses,
    answer: string
  ) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      if (answer.length < 20 || answer.length > 400) {
        throw new Error('Answer must be between 20 and 400 characters');
      }

      const userRef = doc(db, 'users', user.uid);
      
      const updates: any = {
        [`questionnaire.onboarding.responses.${questionId}.answer`]: answer,
        [`questionnaire.onboarding.responses.${questionId}.updatedAt`]: serverTimestamp(),
        'questionnaire.onboarding.status.lastUpdated': serverTimestamp(),
        lastLogin: serverTimestamp()
      };
  
      await updateDoc(userRef, updates);
  
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as UserData;
      const responses = userData.questionnaire.onboarding.responses;
      
      const allQuestionsAnswered = Object.values(responses).every(
        response => response.answer.length > 0
      );
  
      if (allQuestionsAnswered) {
        await updateDoc(userRef, {
          'questionnaire.onboarding.status.isComplete': true,
          'questionnaire.onboarding.status.completedAt': serverTimestamp()
        });
      }
  
    } catch (error) {
      console.error('Error updating onboarding response:', error);
      throw error;
    }
  };
  
  const getOnboardingStatus = async () => {
    try {
      if (!user) throw new Error('No user logged in');
  
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as UserData;
      
      const responses = userData.questionnaire.onboarding.responses;
      const completedResponses = Object.entries(responses)
        .filter(([_, response]) => response.answer.length > 0)
        .map(([key]) => key);
  
      return {
        isComplete: userData.questionnaire.onboarding.status.isComplete,
        completedResponses
      };
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      throw error;
    }
  };

  // Return the AuthContext Provider
  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateUserPassword,
        updateDemographics,
        updateProfile,
        updateOnboardingResponse,
        getOnboardingStatus,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Export the custom hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
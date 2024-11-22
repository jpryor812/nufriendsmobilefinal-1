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
  getAuth,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, where } from 'firebase/firestore';


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
    email: string | null;
    username: string;
    createdAt: Date;
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
      birthDate: number  // Changed from string to number
    ) => Promise<void>;
    updateProfile: (updates: {
      username?: string,
      city?: string,
      state?: string
      age?: number
      birthDate?: number  // Changed from string to number
    }) => Promise<void>;
    updateOnboardingResponse: (
        questionId: string,
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

  const updateOnboardingResponse = async (
    questionId: keyof OnboardingResponses,
    answer: string
  ) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Validate answer length
      if (answer.length < 20 || answer.length > 400) {
        throw new Error('Answer must be between 20 and 400 characters');
      }

      const userRef = doc(db, 'users', user.uid);
      
      const updates: any = {
        [`questionnaire.onboarding.responses.${questionId}.answer`]: answer,
        [`questionnaire.onboarding.responses.${questionId}.updatedAt`]: serverTimestamp(),
        'questionnaire.onboarding.status.lastUpdated': serverTimestamp(),
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

  // Update your signup function to include the onboarding structure:
  const signup = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting signup process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Auth with UID:', user.uid);

      // Create user document
      console.log('Attempting to create Firestore document...');
      const userDocRef = doc(db, 'users', user.uid);

      const emptyResponse: OnboardingResponse = {
        answer: '',
        updatedAt: null
      };
      
      const userData = {
        uid: user.uid,
        email: user.email,
        username,
        createdAt: serverTimestamp(),
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
    birthDate?: number  // Add this
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

// Custom hook with type safety
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

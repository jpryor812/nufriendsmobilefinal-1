import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '@/config/firebase';
import { 
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          const emptyResponse: OnboardingResponse = {
            answer: '',
            updatedAt: null
          };
          
          // Create the initial user data with proper types
          const initialUserData: UserData = {
            uid: firebaseUser.uid,
            storedEmail: '',
            storedPassword: '',
            username: `User_${firebaseUser.uid.slice(0, 6)}`,
            createdAt: new Date(), // Use Date for the UserData type
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

          // Create Firestore version with timestamps
          const firestoreData = {
            ...initialUserData,
            createdAt: serverTimestamp()
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
            setUser(null);
          }
        } else {
          // Convert Firestore timestamps to Dates for existing user data
          const firestoreData = userDoc.data();
          const userData: UserData = {
            uid: firestoreData.uid,
            storedEmail: firestoreData.storedEmail,
            storedPassword: firestoreData.storedPassword,
            username: firestoreData.username,
            createdAt: firestoreData.createdAt.toDate(),
            demographics: firestoreData.demographics,
            stats: firestoreData.stats,
            subscription: firestoreData.subscription,
            avatar: firestoreData.avatar,
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
            }
          };

          const responses = userData.questionnaire.onboarding.responses;
          const questionOrder: (keyof OnboardingResponses)[] = [
            'location',
            'hobbies',
            'relationships',
            'music',
            'entertainment',
            'travel',
            'aspirations'
          ];
          const firstUnanswered = questionOrder.find((q) => !responses[q]?.answer);
          
          setUser({
            ...firebaseUser,
            userData
          });
          setOnboardingProgress({
            isComplete: !firstUnanswered,
            firstUnanswered: firstUnanswered || null,
          });
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error('Failed to sign in anonymously:', error);
          setUser(null);
        }
      }
      setLoading(false);
    });
  
    return unsubscribe;
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
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const emptyResponse: OnboardingResponse = {
        answer: '',
        updatedAt: null
      };
      
      const initialUserData: UserData = {
        uid: currentUser.uid,
        storedEmail: email,
        storedPassword: password,
        username,
        createdAt: new Date(),
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

      const firestoreData = {
        ...initialUserData,
        createdAt: serverTimestamp()
      };

      await setDoc(userDocRef, firestoreData);
      setUser({
        ...currentUser,
        userData: initialUserData
      });

    } catch (error) {
      console.error('Error in signup process:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Query user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('storedEmail', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid email or password');
      }
  
      const userDoc = querySnapshot.docs[0];
      const firestoreData = userDoc.data();
  
      // Simple password comparison for testing
      if (firestoreData.storedPassword !== password) {
        throw new Error('Invalid email or password');
      }
  
      // Convert Firestore timestamps to Dates
      const userData: UserData = {
        uid: firestoreData.uid,
        storedEmail: firestoreData.storedEmail,
        storedPassword: firestoreData.storedPassword,
        username: firestoreData.username,
        createdAt: firestoreData.createdAt.toDate(),
        demographics: firestoreData.demographics,
        stats: firestoreData.stats,
        subscription: firestoreData.subscription,
        avatar: firestoreData.avatar,
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
        }
      };
  
      // Sign in anonymously if not already signed in
      let currentUser = auth.currentUser;
      if (!currentUser) {
        const anonymousAuth = await signInAnonymously(auth);
        currentUser = anonymousAuth.user;
      }
  
      // Update user state
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
      
      // Verify current password
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (userData?.storedPassword !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      await updateDoc(doc(db, 'users', user.uid), {
        storedPassword: newPassword
      });

    } catch (error) {
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

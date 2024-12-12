import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Vibration, TouchableOpacity, Image } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, app, auth, functions as baseFunctions } from '@/config/firebase';
import BigYuSearching from "@/components/BigYuSearching";
import SearchingBubble from "@/components/SearchingBubble";
import FoundFriendProfile from "@/components/FoundFriendProfile";
import SafeLayout from '@/components/SafeLayout';
import ConfettiEffect from '@/components/ConfettiEffect';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { FirebaseError } from 'firebase/app';  


interface Friend {
  uid: string;  // Changed from id to uid
  username: string;
  demographics: {
    gender: string;
    state: string;
    city: string;
    age: number;
    birthDate: number;  // Added
  };
  profileSummaries?: {  // Add this field
    entertainment: string;
    goals: string;
    hobbies: string;
    isVisible: boolean;
    location: string;
    music: string;
    travel: string;
  };
  onboarding: {  // Added onboarding structure
    responses: {
      aspirations: { answer: string; updatedAt: null };
      entertainment: { answer: string; updatedAt: null };
      hobbies: { answer: string; updatedAt: null };
      location: { answer: string; updatedAt: null };
      music: { answer: string; updatedAt: null };
      relationships: { answer: string; updatedAt: null };
      travel: { answer: string; updatedAt: null };
    };
    status: {
      completedAt: Timestamp;
      isComplete: boolean;
      lastUpdated: Timestamp;
    };
  };
  stats: {  // Added stats
    aiInteractions: number;
    conversationsStarted: number;
    messagesSent: number;
  };
  matchDetails?: {
    compatibilityScore: number;
    waitingScore: number;
    finalScore: number;
    matchReason?: string;
    commonInterests?: string[];
  };
}
interface MatchFunctionResponse {
  data: {
    matchId: string;
    userId: string;
    scores: {
      compatibility: number;
      waiting: number;
      final: number;
    };
    matchReason?: string;
    commonInterests?: string[];
  };
}

const { height } = Dimensions.get('window');

const SEARCHING_MESSAGES = [
  "Analyzing profiles...",
  "Finding compatible friends...",
  "Matching interests...",
  "Almost there...",
  "Found some great matches!"
];

const FindingFriends = () => {
  const params = useLocalSearchParams();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchingText, setSearchingText] = useState(SEARCHING_MESSAGES[0]);
  const [searchingComplete, setSearchingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchingSlideAnim = useRef(new Animated.Value(0)).current;
  const profileSlideAnim = useRef(new Animated.Value(height)).current;
  const messageChangeInterval = useRef<NodeJS.Timeout>();

  const runAnimationSequence = () => {
    Vibration.vibrate(200);

    Animated.parallel([
      Animated.timing(searchingSlideAnim, {
        toValue: -height,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(250),
        Animated.timing(profileSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      setTimeout(() => {
        setShowConfetti(true);
      }, 200);
    });
  };

  const handleNextFriend = () => {
    console.log("Before transition - Current index:", currentFriendIndex);
    console.log("Before transition - Total friends:", friends.length);

    if (currentFriendIndex === friends.length - 1) {
        router.replace('/HomePage');
        return;
    }

    // Reset animations
    setShowConfetti(false);
    
    // Slide current profile out and next profile in
    Animated.parallel([
      Animated.timing(profileSlideAnim, {
        toValue: -height,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentFriendIndex(prev => prev + 1);
      profileSlideAnim.setValue(height);
      
      // Animate new profile in
      Animated.timing(profileSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowConfetti(true);
      });
    });
  };

  const fetchMatchedFriends = async () => {
    try {
        const currentUser = auth.currentUser;
        console.log('Current user state:', {
            exists: !!currentUser,
            uid: currentUser?.uid,
            emailVerified: currentUser?.emailVerified
        });

        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const findMatchFunction = httpsCallable(baseFunctions, 'findMatch');
        let successfulMatches = [];
        let attemptCount = 0;
        const maxAttempts = 6; // Allow up to 6 attempts to get 3 valid matches

        // Keep trying until we have 3 valid matches or hit max attempts
        while (successfulMatches.length < 3 && attemptCount < maxAttempts) {
            try {
                console.log(`Attempt ${attemptCount + 1} to find match`);
                const result = await findMatchFunction({ 
                    userId: currentUser.uid,
                    attemptNumber: attemptCount + 1,
                    timestamp: Date.now()
                });
                
                if (result && result.data) {
                  const matchResult = result as MatchFunctionResponse;
                  const userDoc = await getDoc(doc(db, 'users', matchResult.data.userId));
                  const userData = userDoc.data();
                    
                    if (userData) {
                        // Only add to successful matches if we can get the user data
                        successfulMatches.push({
                          uid: matchResult.data.userId,
                          username: userData.username,
                          demographics: userData.demographics,
                          profileSummaries: userData.profileSummaries,
                          onboarding: userData.onboarding,
                          stats: userData.stats,
                          matchDetails: {
                              compatibilityScore: matchResult.data.scores.compatibility,
                              waitingScore: matchResult.data.scores.waiting,
                              finalScore: matchResult.data.scores.final,
                              matchReason: matchResult.data.matchReason,
                              commonInterests: matchResult.data.commonInterests
                          }
                      });
                        console.log(`Successfully added match ${successfulMatches.length}`);
                    } else {
                      console.log(`Skipping match due to missing user data for ID: ${matchResult.data.userId}`);
                    }
                }
            } catch (error) {
                console.error(`Match attempt ${attemptCount + 1} failed:`, error);
                // Continue to next attempt
            }
            
            attemptCount++;
        }

        console.log(`Match attempts completed. Found ${successfulMatches.length} valid matches`);

        if (successfulMatches.length === 0) {
            throw new Error('No matches found. Please try again later.');
        }

        // Sort matches by final score
        successfulMatches.sort((a, b) => 
            (b.matchDetails?.finalScore || 0) - (a.matchDetails?.finalScore || 0)
        );

        setFriends(successfulMatches);
        setSearchingComplete(true);
        setIsLoading(false);

        if (messageChangeInterval.current) {
            clearInterval(messageChangeInterval.current);
        }

        setTimeout(() => {
            runAnimationSequence();
        }, 1000);

    } catch (error) {
        console.error('Error finding matches:', error);
        setError('Unable to find matches at this time. Please try again later.');
        setIsLoading(false);
        if (messageChangeInterval.current) {
            clearInterval(messageChangeInterval.current);
        }
    }
};

useEffect(() => {
    fetchMatchedFriends();
    
    return () => {
        if (messageChangeInterval.current) {
            clearInterval(messageChangeInterval.current);
        }
    };
}, []);

  const currentFriend = friends[currentFriendIndex];
  const isLastFriend = currentFriendIndex === friends.length - 1;

  console.log("All matched friends:", friends);
console.log("Current friend index:", currentFriendIndex);
console.log("Current friend being shown:", currentFriend);

  if (error) {
    return (
      <SafeLayout style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              fetchMatchedFriends();
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout style={styles.container}>
      {!searchingComplete && (
        <Animated.View 
          style={[
            styles.contentContainer, 
            { transform: [{ translateY: searchingSlideAnim }] }
          ]}
        >
          <BigYuSearching text={searchingText} />
          <SearchingBubble />
        </Animated.View>
      )}

      {currentFriend && (
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              transform: [{ translateY: profileSlideAnim }],
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          ]}
        > 
          <FoundFriendProfile 
            friend={currentFriend}
/>
          
          <TouchableOpacity
            style={[
              styles.continueButton,
              isLastFriend && styles.finalButton
            ]}
            onPress={handleNextFriend}
          >
            <View style={styles.buttonContent}>
              <Image 
                source={require('../assets/images/Yu_excited_no_speech.png')}
                style={styles.buttonImage} 
              />
              <Text style={styles.continueButtonText}>
                {isLastFriend ? "Chat With Your Friends!" : "Meet Your Next Friend!"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {showConfetti && (
        <ConfettiEffect 
          count={150}
          duration={1500}
          colors={['#FFD700', '#FF69B4', '#7FFFD4', '#FF4500', '#42ade2']}
        />
      )}
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FCFE',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#42ade2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#42ade2',
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 300, // Add this to make button wider if needed
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 34,
    height: 34,
    marginRight: 6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  finalButton: {
    backgroundColor: '#7CC9FF',
  },
  chatButton: {
    backgroundColor: '#42ade2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatButtonDisabled: {
    backgroundColor: '#a0d8f4',
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  }
});

export default FindingFriends;
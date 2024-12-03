import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Vibration, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { findMatch } from '../functions/src';
import BigYuSearching from "@/components/BigYuSearching";
import SearchingBubble from "@/components/SearchingBubble";
import FoundFriendProfile from "@/components/FoundFriendProfile";
import SafeLayout from '@/components/SafeLayout';
import ConfettiEffect from '@/components/ConfettiEffect';

interface Friend {
  user_id: string;
  username: string;
  demographics: {
    gender: string;
    state: string;
    city: string;
    age: number;
    birth_date: number;
  };
  onboarding_responses: {
    aspirations: string;
    entertainment: string;
    hobbies: string;
    location: string;
    music: string;
    travel: string;
  };
  user_stats: {
    ai_interactions: number;
    conversations_started: number;
    messages_sent: number;
  };
  match_details?: {
    compatibility_score: number;
    waiting_score: number;
    final_score: number;
    match_reason?: string;
    common_interests?: string[];
  };
}

interface MatchResponse {
  matchId: string;
  userId: string;
  scores: {
    compatibility: number;
    waiting: number;
    final: number;
  };
  matchReason?: string;
  commonInterests?: string[];
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
  const { user } = useAuth();
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
    if (currentFriendIndex === friends.length - 1) {
      router.replace('/HomePage');
      return;
    }

    setShowConfetti(false);
    
    Animated.parallel([
      Animated.timing(profileSlideAnim, {
        toValue: -height,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentFriendIndex(prev => prev + 1);
      profileSlideAnim.setValue(height);
      
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
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Start message rotation
      let messageIndex = 0;
      messageChangeInterval.current = setInterval(() => {
        messageIndex = (messageIndex + 1) % SEARCHING_MESSAGES.length;
        setSearchingText(SEARCHING_MESSAGES[messageIndex]);
      }, 2000);

      // Make 5 match attempts
      const matchPromises = Array(5).fill(null).map(async (_, index) => {
        try {
          const result = await findMatch(user.id);
          console.log(`Match attempt ${index + 1} result:`, result);
          return result;
        } catch (error) {
          console.error(`Match attempt ${index + 1} failed:`, error);
          throw error;
        }
      });

      const matchResults = await Promise.all(matchPromises);
      console.log('All match calls completed');

      // Fetch matched friends' data
      const matchedFriends = await Promise.all(
        matchResults
          .filter(result => result && result.userId)
          .map(async (result) => {
            try {
              const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select(`
                  *,
                  demographics (*),
                  onboarding_responses (*),
                  user_stats (*)
                `)
                .eq('user_id', result.userId)
                .single();

              if (userError || !userData) {
                console.error(`User data not found for ID: ${result.userId}`);
                return null;
              }

              return {
                user_id: result.userId,
                username: userData.username,
                demographics: userData.demographics,
                onboarding_responses: userData.onboarding_responses,
                user_stats: userData.user_stats,
                match_details: {
                  compatibility_score: result.scores.compatibility,
                  waiting_score: result.scores.waiting,
                  final_score: result.scores.final,
                  match_reason: '',
                  common_interests: []
                }
              };
            } catch (error) {
              console.error(`Error processing match for user ${result.userId}:`, error);
              return null;
            }
          })
      );

      const validMatchedFriends = matchedFriends.filter(friend => friend !== null) as Friend[];

      if (validMatchedFriends.length === 0) {
        throw new Error('No valid matches were found after processing');
      }

      setFriends(validMatchedFriends);
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
            <Text style={styles.continueButtonText}>
              {isLastFriend ? "Start Chatting!" : "Meet Next Friend"}
            </Text>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  finalButton: {
    backgroundColor: '#4CAF50',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default FindingFriends;
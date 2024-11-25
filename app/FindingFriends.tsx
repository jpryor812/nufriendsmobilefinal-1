import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Vibration, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import BigYuSearching from "@/components/BigYuSearching";
import SearchingBubble from "@/components/SearchingBubble";
import FoundFriendProfile from "@/components/FoundFriendProfile";
import SafeLayout from '@/components/SafeLayout';
import ConfettiEffect from '@/components/ConfettiEffect';

interface Friend {
  id: string;
  username: string;
  demographics: {
    gender: string;
    state: string;
    city: string;
    age: number;
  };
}

const { height } = Dimensions.get('window');

const FindingFriends = () => {
  const params = useLocalSearchParams();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentFriendIndex, setCurrentFriendIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchingText, setSearchingText] = useState("Hang tight! Finding your new friends...");
  const [searchingComplete, setSearchingComplete] = useState(false);
  
  const searchingSlideAnim = useRef(new Animated.Value(0)).current;
  const profileSlideAnim = useRef(new Animated.Value(height)).current;

  const runAnimationSequence = () => {
    Vibration.vibrate(200);

    Animated.sequence([
      Animated.timing(searchingSlideAnim, {
        toValue: height,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      setTimeout(() => {
        setShowConfetti(true);
        Animated.timing(profileSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 500);
    });
  };

  const handleContinue = () => {
    if (currentFriendIndex === friends.length - 1) {
      // Last friend, navigate to home
      router.replace('/home');
      return;
    }

    // Reset animations for next friend
    setShowConfetti(false);
    profileSlideAnim.setValue(height);
    
    // Show next friend with animation
    setCurrentFriendIndex(prev => prev + 1);
    setTimeout(() => {
      runAnimationSequence();
    }, 100);
  };

  useEffect(() => {
    const findMatches = async () => {
      try {
        const filters = JSON.parse(params.filters as string);
        const currentUser = auth.currentUser;
        const currentUserDoc = await getDoc(doc(db, 'users', currentUser?.uid || ''));
        const currentUserData = currentUserDoc.data();

        // TODO: Replace this with actual AI matching logic
        // This is where you'll make the OpenAI API call with your GPT-3.5 matching prompt
        const matchingUsers = await fetchPotentialMatches(filters, currentUserData);
        
        setFriends(matchingUsers);
        setSearchingComplete(true);
        
        // Start animation sequence for first friend
        setTimeout(() => {
          runAnimationSequence();
        }, 2000);

      } catch (error) {
        console.error('Error finding matches:', error);
      }
    };

    findMatches();
  }, [params.filters]);

  const currentFriend = friends[currentFriendIndex];
  const isLastFriend = currentFriendIndex === friends.length - 1;

  return (
    <SafeLayout style={styles.container}>
      {!searchingComplete && (
        <Animated.View 
          style={[styles.contentContainer, { transform: [{ translateY: searchingSlideAnim }] }]}
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
              justifyContent: 'center',
              marginTop: -1200,
            }
          ]}
        > 
          <FoundFriendProfile friend={currentFriend} />
          
          <TouchableOpacity
            style={[
              styles.continueButton,
              isLastFriend && styles.finalButton
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {isLastFriend ? "Go to Messages" : "Meet Next Friend"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {showConfetti && (
        <ConfettiEffect 
          count={250}
          duration={2000}
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
    backgroundColor: '#F0FCFE',
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
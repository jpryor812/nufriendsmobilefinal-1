import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Vibration } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import BigYuSearching from "@/components/BigYuSearching";
import SearchingBubble from "@/components/SearchingBubble";
import { friendsData } from '../constants/FriendsData';
import FoundFriendProfile from "@/components/FoundFriendProfile";
import SafeLayout from '@/components/SafeLayout';
import ConfettiEffect from '@/components/ConfettiEffect';

interface Friend {
  id: number;
  initials: string;
  name: string;
  messages: number;
  daysAsFriends: number;
  streak: number;
  mutualFriends: number;
  avatar: any;
  city: string;
  state: string;
  country: string;
  age: number;
  gender: string;
}

const { height } = Dimensions.get('window');

const FindingFriends: React.FC = () => {
  const params = useLocalSearchParams();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchingText, setSearchingText] = useState("Hang tight! I'll find your new friend in just a few seconds...");
  
  // Animation values
  const searchingSlideAnim = useRef(new Animated.Value(0)).current;
  const profileSlideAnim = useRef(new Animated.Value(height)).current;

  const runAnimationSequence = (friend: Friend) => {
    setSelectedFriend(friend);

    // Vibrate when starting slide-out animation
    Vibration.vibrate(200);

    // Sequence of animations
    Animated.sequence([
      // Slide searching content down
      Animated.timing(searchingSlideAnim, {
        toValue: height,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Start the profile reveal sequence after slide-down
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

  React.useEffect(() => {
    const filters = JSON.parse(params.filters as string);
    let matchingFriends = [...friendsData];

    if (filters.genders.length > 0) {
      matchingFriends = matchingFriends.filter(friend => 
        filters.genders.includes(friend.gender)
      );
    }
    if (filters.states.length > 0) {
      matchingFriends = matchingFriends.filter(friend => 
        filters.states.includes(friend.state)
      );
    }
    if (filters.cities.length > 0) {
      matchingFriends = matchingFriends.filter(friend => 
        filters.cities.includes(friend.city)
      );
    }

    // Change text and vibrate after 3 seconds
    const textTimer = setTimeout(() => {
      Vibration.vibrate(200);
      setSearchingText("Starting the conversation...");
    }, 4000);

    // Run animation sequence after 6 seconds
    const animationTimer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * matchingFriends.length);
      runAnimationSequence(matchingFriends[randomIndex]);
    }, 7000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(animationTimer);
      Vibration.cancel();
    };
  }, [params.filters]);

  return (
    <SafeLayout style={styles.container}>
      {/* Searching Content */}
      <Animated.View 
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY: searchingSlideAnim }]
          }
        ]}
      >
        <BigYuSearching text={searchingText} />
        <SearchingBubble />
      </Animated.View>

      {/* Profile Content */}
      {selectedFriend && (
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
          <FoundFriendProfile friend={selectedFriend} />
        </Animated.View>
      )}

      {/* Confetti Effect */}
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
  }
});

export default FindingFriends;
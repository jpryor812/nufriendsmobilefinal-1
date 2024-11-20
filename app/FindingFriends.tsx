import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Vibration } from "react-native";
import { useLocalSearchParams } from 'expo-router';
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

const FindingFriends: React.FC = () => {
  const params = useLocalSearchParams();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchingText, setSearchingText] = useState("Hang tight! I'll find your new friend in just a few seconds...");
  
  const searchingSlideAnim = useRef(new Animated.Value(0)).current;
  const profileSlideAnim = useRef(new Animated.Value(height)).current;

  const runAnimationSequence = (friend: Friend) => {
    setSelectedFriend(friend);
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

  React.useEffect(() => {
    const findMatch = async () => {
      try {
        const filters = JSON.parse(params.filters as string);
        const currentUser = auth.currentUser;
        const currentUserDoc = await getDoc(doc(db, 'users', currentUser?.uid || ''));
        const currentUserAge = currentUserDoc.data()?.demographics?.age || 0;

        let q = query(collection(db, 'users'));
        const conditions = [];

        if (filters.genders.length > 0) {
          conditions.push(where('demographics.gender', 'in', filters.genders));
        }
        if (filters.states.length > 0) {
          conditions.push(where('demographics.state', 'in', filters.states));
        }
        if (filters.cities.length > 0) {
          conditions.push(where('demographics.city', 'in', filters.cities));
        }

        if (conditions.length > 0) {
          q = query(q, ...conditions);
        }

        const querySnapshot = await getDocs(q);
        const matchingUsers = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            username: doc.data().username,
            demographics: {
              gender: doc.data().demographics.gender,
              state: doc.data().demographics.state,
              city: doc.data().demographics.city,
              age: doc.data().demographics.age
            }
          }))
          .filter(user => {
            const userAge = user.demographics.age;

            // Skip current user and age validation
            if (user.id === currentUser?.uid || userAge < 13) {
              return false;
            }

            // Age group filtering
            if (currentUserAge >= 13 && currentUserAge <= 17) {
              return userAge >= 13 && userAge <= 17;
            }

            if (currentUserAge >= 18 && currentUserAge <= 20) {
              return userAge >= 18 && userAge <= 24;
            }

            const minAge = Math.max(18, currentUserAge - 4);
            const maxAge = currentUserAge + 4;
            return userAge >= minAge && userAge <= maxAge;
          });

        const textTimer = setTimeout(() => {
          Vibration.vibrate(200);
          setSearchingText("Starting the conversation...");
        }, 4000);

        const animationTimer = setTimeout(() => {
          if (matchingUsers.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingUsers.length);
            const selectedUser = matchingUsers[randomIndex];
            runAnimationSequence(selectedUser);
          }
        }, 7000);

        return () => {
          clearTimeout(textTimer);
          clearTimeout(animationTimer);
          Vibration.cancel();
        };
      } catch (error) {
        console.error('Error finding match:', error);
      }
    };

    findMatch();
  }, [params.filters]);

  return (
    <SafeLayout style={styles.container}>
      <Animated.View 
        style={[styles.contentContainer, { transform: [{ translateY: searchingSlideAnim }] }]}
      >
        <BigYuSearching text={searchingText} />
        <SearchingBubble />
      </Animated.View>

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
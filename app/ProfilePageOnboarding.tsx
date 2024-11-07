import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions } from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import FriendProfileVertical from '../components/FriendProfileVertical';
import DatingToggle from '../components/DatingToggle';
import MessagesChart from '../components/MessagesChart';
import ActiveStreaks from '../components/ActiveStreaks';
import StatsBar from '../components/UserStatsContainer';
import AchievementsSection from '@/components/AchievementsSection';
import FooterNavigation from '../components/FooterNavigation';
import SearchingDots from '@/components/SearchingDots';
import MiniYuOnboarding from '@/components/MiniYuOnboarding';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

const ProfilePageOnboarding = () => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [onboardingText, setOnboardingText] = useState(
      'Here is what your profile could look like after a few months of meeting new friends!'
    );
  
    const runAnimation = (newText: string, newPosition: number, delay: number = 0) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setOnboardingText(newText);
            
            Animated.timing(slideAnim, {
              toValue: newPosition,
              duration: 500,
              useNativeDriver: true,
            }).start(resolve);
          });
        }, delay);
      });
    };

  useEffect(() => {
    const runAnimationSequence = async () => {
      // First animation after 5 seconds
      await runAnimation(
        'You can edit your avatar, username, location, and make it clear whether you are here purely for friendships or would be open to something more through the dating toggle.',
        175,
        6000
      );

      // Second animation after 5 more seconds
      await runAnimation(
        "You can see your daily, weekly, and monthy stats for messaging and making friends. Soon you'll be pretty popular!",
        500,
        11000
      );

      await runAnimation(
        'Lastly, you can see your daily messaging streaks with your closest friends!',
        350,
        7000
      );

      // Wait a brief moment to show the final message, then navigate
      setTimeout(() => {
        router.push('/OnboardingPreAvatar'); // Replace with your desired route
      }, 6000);
    };
    
    runAnimationSequence();

    return () => {
      // Cleanup any ongoing animations
      slideAnim.stopAnimation();
    };
  }, []);

  const handleFindFriends = () => {
    console.log('Find friends');
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SearchingDots />
        <Animated.View
          style={[
            styles.onboardingContainer,
            {
              transform: [{ translateY: slideAnim }],
              zIndex: 999, // Ensure it stays on top
            },
          ]}
        >
          <MiniYuOnboarding text={onboardingText} />
        </Animated.View>
        <View style={styles.friendProfileContainer}>
          <FriendProfileVertical 
            imageSource={require('../assets/images/profile_picture.jpg')} 
            name="Jpp123" 
            onPress={() => console.log('Friend profile pressed')}
          />
          <DatingToggle />
        </View>
        <View style={styles.chartContainer}>
          <MessagesChart />
        </View>
        <StatsBar currentWeek={0} />
        <ActiveStreaks />
      </ScrollView>
      <FooterNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  friendProfileContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#F0FCFE',
  },
  onboardingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default ProfilePageOnboarding;
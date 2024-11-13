import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions, Text } from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import FriendProfileVertical from '../components/FriendProfileVertical';
import DatingToggle from '../components/DatingToggle';
import MessagesChart from '../components/MessagesChart';
import ActiveStreaks from '../components/ActiveStreaks';
import StatsBar from '../components/UserStatsContainer';
import AchievementsSection from '@/components/AchievementsSection';
import FooterNavigation from '../components/FooterNavigationIOS';
import SearchingDots from '@/components/SearchingDots';
import MiniYuOnboarding from '@/components/MiniYuOnboarding';
import { router } from 'expo-router';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import SafeLayout from '@/components/SafeLayout';

const { height, width } = Dimensions.get('window');

const ProfilePageOnboarding = () => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const pointerAnim = useRef(new Animated.Value(0)).current;
    const [showPointer, setShowPointer] = useState(false);
    const [canNavigate, setCanNavigate] = useState(false);
    const [onboardingText, setOnboardingText] = useState(
      'Here is what your profile could look like after a few months of meeting new friends!'
    );
  
    const startPointerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pointerAnim, {
            toValue: -10,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pointerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const handleNavigation = () => {
      if (canNavigate) {
        router.push('/RelationshipTracker');
      }
    };

    const runAnimation = (newText: string, newPosition: number, delay: number = 0) => {
        return new Promise<void>((resolve) => {
          if (showPointer) {
            resolve(); // Now TypeScript knows this is resolving a Promise<void>
            return;
          }

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
        // First animation
        await runAnimation(
          'You can edit your avatar, username, location, and make it clear whether you are here purely for friendships or would be open to something more through the dating toggle.',
          175,
          6000
        );

        // Second animation
        await runAnimation(
          "You can see your daily, weekly, and monthy stats for messaging and making friends. Soon you'll be pretty popular!",
          500,
          11000
        );

        // Third animation
        await runAnimation(
          'Lastly, you can see your daily messaging streaks with your closest friends!',
          350,
          7000
        );

        // Final position and show pointer
        await runAnimation(
          "This page tracks all of your friendships. Let's see how you can track one specific friendships by tapping the see more button",
          350,
          5000
        );

        setShowPointer(true);
        setCanNavigate(true);
        startPointerAnimation();
      };
      
      runAnimationSequence();

      return () => {
        slideAnim.stopAnimation();
        pointerAnim.stopAnimation();
      };
    }, []);

    return (
      <SafeLayout style={styles.container}>
        <ScrollSafeLayout contentContainerStyle={styles.scrollViewContent}>
          <SearchingDots />
          <Animated.View
            style={[
              styles.onboardingContainer,
              {
                transform: [{ translateY: slideAnim }],
                zIndex: 999,
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
        </ScrollSafeLayout>
        
        
        {showPointer && (
          <Animated.View
            style={[
              styles.pointer,
              {
                transform: [{ translateY: pointerAnim }],
              },
            ]}
          >
            <Text style={styles.pointerText}>👇</Text>
          </Animated.View>
        )}
      </SafeLayout>
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
  pointer: {
    position: 'absolute',

    bottom: 250, // Adjust based on your footer navigation height
    zIndex: 1000,
    right: 30,
  },
  pointerText: {
    fontSize: 30,
  },
});

export default ProfilePageOnboarding;
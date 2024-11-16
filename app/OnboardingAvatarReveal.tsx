import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Vibration, Image } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link, useRouter } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import ConfettiEffect from '@/components/ConfettiEffect';

const OnboardingAvatarReveal = () => {
    const [currentText, setCurrentText] = useState("Now, let's go ahead and...");
    const [showConfetti, setShowConfetti] = useState(false);
    const yuSlideAnim = useRef(new Animated.Value(0)).current;
    const avatarSlideAnim = useRef(new Animated.Value(1000)).current;
    const router = useRouter();
  
    useEffect(() => {
      // First text change after 2 seconds
      const timer1 = setTimeout(() => {
        Vibration.vibrate(200);
        setCurrentText("Oh wait...");
      }, 2000);
  
      // Second text change after 4 seconds
      const timer2 = setTimeout(() => {
        Vibration.vibrate(200);
        setCurrentText("What's that???");
      }, 4000);
  
      // Slide out Yu and slide in avatar
      const timer3 = setTimeout(() => {
        // Slide Yu out bottom
        Animated.timing(yuSlideAnim, {
          toValue: 1000,
          duration: 800,
          useNativeDriver: true,
        }).start();
  
        // Slight delay before sliding up avatar
        setTimeout(() => {
          setShowConfetti(true); // Start confetti
          Animated.spring(avatarSlideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }).start();
  
          // Add navigation timer after confetti starts
          const navigationTimer = setTimeout(() => {
            router.push('/OnboardingAvatarCustomization');
          }, 4000);
  
          return () => clearTimeout(navigationTimer);
        }, 900);
      }, 6000);
  
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);
  
    return (
      <SafeLayout style={styles.appContainer}>
        <ProgressBar progress={100} />
        
        {/* Yu Component that slides down */}
        <Animated.View style={{
          transform: [{ translateY: yuSlideAnim }]
        }}>
          <BigYuOnboarding text={currentText} />
        </Animated.View>

        {/* Avatar that slides up */}
        <Animated.View style={[
          styles.avatarContainer,
          {
            transform: [{ translateY: avatarSlideAnim }]
          }
        ]}>
          <Image 
            source={require('../assets/images/profile_picture.jpg')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Imported Confetti Effect */}
        {showConfetti && <ConfettiEffect />}
      </SafeLayout>
    );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#F0FCFE',
  },
  avatarContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '30%',
  },
  avatarImage: {
    width: 180,
    height: 180,
  },
});

export default OnboardingAvatarReveal;
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Vibration, Image } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link, useRouter } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';

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
            router.push('/OnboardingAvatarCustomization'); // Replace with your actual route
          }, 4000); // This will navigate 4 seconds after confetti starts
  
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

      {/* Confetti overlay */}
      {showConfetti && <ConfettiEffect />}
    </SafeLayout>
  );
};

// Confetti Effect Component
const ConfettiEffect = () => {
  const confettiPieces = Array(120).fill(0).map((_, i) => {
    const animValue = new Animated.Value(0);
    
    Animated.sequence([
      Animated.delay(Math.random() * 500),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 1500 + Math.random() * 1000,
        useNativeDriver: true,
      })
    ]).start();

    return {
      left: `${Math.random() * 100}%`,
      animation: animValue,
      color: ['#FFD700', '#FF69B4', '#7FFFD4', '#FF4500'][Math.floor(Math.random() * 4)],
    };
  });

  return (
    <View style={styles.confettiContainer}>
      {confettiPieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confettiPiece,
            {
              left: piece.left,
              backgroundColor: piece.color,
              transform: [{
                translateY: piece.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 800]
                })
              }, {
                rotate: piece.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1)}deg`]
                })
              }]
            }
          ]}
        />
      ))}
    </View>
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
    top: '30%', // Adjust as needed
  },
  avatarImage: {
    width: 180, // Adjust size as needed
    height: 180,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // ... rest of your existing styles
});

export default OnboardingAvatarReveal;
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Animated, Easing } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link } from 'expo-router';
import SearchingDots from '../components/SearchingDots';
import FooterNavigation from '@/components/FooterNavigation';

const OnboardingStartSearching = () => {
    const [fadeAnim] = useState(new Animated.Value(0));
  
    useEffect(() => {
      // Delay the start of animation by 1.5 seconds
      const timer = setTimeout(() => {
        startFading();
      }, 1500);
  
      return () => clearTimeout(timer);
    }, []);
  
    const startFading = () => {
      Animated.loop(
        Animated.sequence([
          // Fade in
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          // Fade out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    };

    return (
        <SafeAreaView style={styles.appContainer}>
          <ProgressBar progress={86} />
          <View style={styles.searchingContainer}>
            <SearchingDots 
              baseText="Searching For Friends"
              textStyle={{ fontSize: 12, color: '#8d8d8d' }}
            />
          </View>
          <BigYuOnboarding text="While I look, I wanted to let you know that you can message with me to help with social situations in the real world too! Tap my icon to see how." />
          <View style={styles.arrow_container}>
            <Animated.Text 
              style={[
                styles.arrowEmoji, 
                { 
                  opacity: fadeAnim
                }
              ]}
            >
              👇
            </Animated.Text>
          </View>
          <View style={styles.link_container}>
            <View style={styles.footer}>
              <View style={styles.navItem}>
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/house_emoji.png')} style={styles.icon} />
                </View>
              </View>
    
              <View style={styles.navItem}>
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/profile_picture.jpg')} style={styles.profileicon} />
                </View>
              </View>
    
              <View style={styles.navItem}>
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/hand_progress_bar.png')} style={styles.icon} />
                </View>
              </View>
    
              <View style={styles.navItem}>
                <Link href={"/OnboardingChatRoomYu"} style={styles.footerItem}>
                  <Image source={require('../assets/images/yu_progress_bar.png')} style={styles.Yuicon} />
                </Link>
              </View>
            </View>
          </View>
        </SafeAreaView>
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
  link_container: {
        width: '100%',
  },
  link: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continue_button_container: {
    width: 300,
    height: 50, // Fixed height for the button
    backgroundColor: '#6ECFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continue_button_text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center', // For Android
  },
  searchingContainer: {
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: 40, // Adjust this value as needed
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#EBF7FE',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 1,
    opacity: 0.5, // Make non-interactive icons appear slightly faded
  },
  profileicon: {
    width: 30,
    height: 30,
    marginBottom: 1,
    borderRadius: 50,
    opacity: 0.5, // Make non-interactive icons appear slightly faded
  },
  Yuicon: {
    width: 36,
    height: 36,
    marginBottom: 1,
  },
  indicatorContainer: {
    width: 30,
    height: 3,
    marginTop: 5,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  activeIndicatorContainer: {
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  indicator: {
    width: '100%',
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#F0FCFE',
  },
  activeIndicator: {
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
  },
  arrow_container: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 36, // Adjust this value to position the arrow above the Yu icon
    marginTop: 'auto', // This will push the arrow to the bottom
    marginBottom: 5,
  },
  arrowEmoji: {
    fontSize: 36,
  },
});

export default OnboardingStartSearching;
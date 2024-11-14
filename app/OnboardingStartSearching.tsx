import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Animated, Easing, TouchableOpacity } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link } from 'expo-router';
import SearchingDots from '../components/SearchingDots';
import FooterNavigation from '@/components/FooterNavigationIOS';
import SafeLayout from '@/components/SafeLayout';

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
        <SafeLayout style={styles.appContainer}>
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
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/house_emoji.png')} style={styles.icon} />
              </View>
    
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/profile_picture.jpg')} style={styles.profileicon} />
                </View>
    
                <View style={styles.footerItem}>
                  <Image source={require('../assets/images/hand_progress_bar.png')} style={styles.icon} />
                </View>
    

                <View style={styles.footerItem}>
                    <Link href="/OnboardingChatRoomYu" asChild>
                        <TouchableOpacity>
                            <Image source={require('../assets/images/yu_progress_bar.png')} style={styles.Yuicon} />
                        </TouchableOpacity>
                    </Link>
                </View>
              </View>
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
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    borderTopWidth: 2,
    borderTopColor: '#EBF7FE',
    width: '100%',
    flexDirection: 'row',
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
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
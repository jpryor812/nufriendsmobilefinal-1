import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link } from 'expo-router';

const OnboardingPreProfile = () => (
  <View style={styles.appContainer}>
    <ProgressBar progress={92} />
    <BigYuOnboarding text="I hope you're as eager to get started as I am, and to conclude our onboarding time together, I want to finish by showing you how exciting this experience can be for you if you use nufriends to its fullest potential." />

    <View style={styles.link_container}>
      <Link href="/ProfilePageOnboarding" style={styles.link}>
        <View style={styles.continue_button_container}>
          <Text style={styles.continue_button_text}>Continue</Text>
        </View>
      </Link>
    </View>
  </View>
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#F0FCFE',
  },
  link_container: {
    marginBottom: '10%',
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
});

export default OnboardingPreProfile;
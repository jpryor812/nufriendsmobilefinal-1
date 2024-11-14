import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';

const OnboardingPostQuestions2 = () => (
  <SafeLayout style={styles.appContainer}>
    <ProgressBar progress={82} />
    <BigYuOnboarding text="I'll start looking for your friends now!" />
    <View style={styles.link_container}>
      <Link href="/OnboardingStartSearching" style={styles.link}>
        <View style={styles.continue_button_container}>
          <Text style={styles.continue_button_text}>Awesome!!</Text>
        </View>
      </Link>
    </View>
  </SafeLayout>
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

export default OnboardingPostQuestions2;
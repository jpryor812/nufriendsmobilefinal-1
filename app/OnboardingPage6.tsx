import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboardingStatic from '../components/BigYuOnboardingStatic';
import { Link } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';

const OnboardingPage6 = () => (
  <SafeLayout style={styles.appContainer}>
    <View style={styles.progressContainer}>
      <ProgressBar progress={25} />
    </View>
    
    <View style={styles.contentContainer}>
      <BigYuOnboardingStatic text="You can just jump right in without worrying about the cold start" />
    </View>

    <View style={styles.link_container}>
      <Link href="/OnboardingSendMessages" style={styles.link}>
        <View style={styles.continue_button_container}>
          <Text style={styles.continue_button_text}>See How It Works!</Text>
        </View>
      </Link>
    </View>
  </SafeLayout>
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link_container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '10%',
  },
  link: {
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continue_button_container: {
    width: 300,
    height: 50,
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
    textAlignVertical: 'center',
  },
});

export default OnboardingPage6;
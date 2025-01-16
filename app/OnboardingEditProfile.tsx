import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import { Link } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import MyProfile from '@/components/MyProfile';
import { ScrollView } from 'react-native';
const OnboardingEditProfile = () => (
  <SafeLayout style={styles.appContainer}>
    <ProgressBar progress={84} />
    <ScrollView>
    <SmallYuOnboarding text="Lastly, what do you want your friends to know about you when they view your profile?" />
    <MyProfile />
    </ScrollView>
    <Text style={styles.continueWarning}>Please Save Your Changes Before Continuing</Text> 
    <View style={styles.link_container}>
      <Link href="/FindingFriends" style={styles.link}>
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
    marginBottom: '1%',
    marginTop: '5%',
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
  continueWarning: {
    marginTop: '5%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1a1',
  },
});

export default OnboardingEditProfile;
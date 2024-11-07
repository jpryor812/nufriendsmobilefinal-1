import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import { Link } from 'expo-router';

const OnboardingPreQuestions = () => (
  <View style={styles.appContainer}>
    <ProgressBar progress={30} />
    <BigYuOnboarding text="There are many more awesome features we'll show you, but first, let's conclude this onboarding process by allowing me to get to know you better to begin those conversations. Please give as much information as possible in the next ten questions and we'll find your five new friends in no time!" />
    
    {/* then type something in the text box and send the message, then after sending the message, router to the next page where we demonstrate using Yu */}

    <View style={styles.link_container}>
      <Link href="/OnboardingBasicQuestions" style={styles.link}>
        <View style={styles.continue_button_container}>
          <Text style={styles.continue_button_text}>I'm ready!</Text>
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

export default OnboardingPreQuestions;
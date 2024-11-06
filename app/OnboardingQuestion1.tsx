import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import InputContainer from '../components/InputContainer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingQuestion1 = ({ navigation }: { navigation: any }) => (
  <View style={styles.appContainer}>
    <ProgressBar progress={10} />
    <BigYuOnboarding 
      text={`Question 1: \nWhere are you from? Was there anything you liked or disliked about your hometown?`} 
    />
    <View style={styles.inputWrapper}>
      <InputContainer 
        placeholder="Type your answer here..."
        onHeightChange={(height) => {
          // Handle height change if needed
        }}
        onSendMessage={(message) => {
          // Handle send message
          navigation.navigate('OnboardingPage11');
        }}
        width={SCREEN_WIDTH * 0.9} // Add width prop
        maxHeight={200} // Add maxHeight prop
      />
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
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20, // Add some padding at the bottom
  },
  // ... rest of your styles
});

export default OnboardingQuestion1;
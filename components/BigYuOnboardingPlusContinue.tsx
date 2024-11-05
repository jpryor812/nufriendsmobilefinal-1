import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

interface BigYuOnboardingPlusContinueProps {
  text: string;
  onContinue: () => void; // Add this prop
}

const BigYuOnboardingPlusContinue: React.FC<BigYuOnboardingPlusContinueProps> = ({ 
  text, 
  onContinue 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.big_yu_chat_bubble_container}>
        <View style={styles.chatBubble}>
          <Text style={styles.big_yu_text}>{text}</Text>
        </View>
        <View style={styles.chatBubbleArrow} />
        <View style={styles.chatBubbleArrowInner} />
        <Image
          source={require('../assets/images/big_yu_question_onboarding.png')}
          style={styles.big_yu_question_onboarding}
          resizeMode='contain'
        />
      </View>
      <TouchableOpacity 
        style={styles.continue_button_container}
        onPress={onContinue}
      >
        <Text style={styles.continue_button_text}>Let's do it!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  big_yu_chat_bubble_container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%',
  },
  chatBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    width: '76%',
    marginBottom: 0, // Remove bottom margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatBubbleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ccc', // Same as chat bubble border color
    alignSelf: 'center',
    marginTop: -2,
    // Slightly overlap with the chat bubble to hide the gap
  },
  big_yu_question_onboarding: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  big_yu_text: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#42ade2',
    fontSize: 20,
  },
  chatBubbleArrowInner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF', // Same as chat bubble background color
    alignSelf: 'center',
    marginTop: -17, // Adjust this to position it correctly over the border arrow
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

export default BigYuOnboardingPlusContinue;
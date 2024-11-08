import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Animated, Dimensions } from 'react-native';

const SmallYuOnboardingAnimated = ({ text }: { text: string }) => {
  // Create animation value
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    // Start animation after 1 second delay
    const timer = setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    // Wrap the entire component in an Animated.View
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          position: 'absolute',
          top: 520,
          width: '100%'
        }
      ]}
    >
      <View style={styles.container}>
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
    </Animated.View>
  );
};

//Just add the continue button to the BigYuOnboarding component
const styles = StyleSheet.create({
    container: {
    alignItems: 'center',
    width: '100%',
  },
  chatBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 12,
    width: '64%',
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
    width: 80,
    height: 80,
    alignItems: 'center',
  },
  big_yu_text: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#42ade2',
    fontSize: 14,
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
});

export default SmallYuOnboardingAnimated;
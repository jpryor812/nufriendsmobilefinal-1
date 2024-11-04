import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing } from 'react-native';

const BigYuSearching = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  
  // Create an animated value for the bouncing motion
  const bounceAnim = new Animated.Value(0);

  // Text change effect - changes once after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayText("I'm sure I'll find your new friend soon, but if you're getting bored, feel free to explore the app. I'll let you know when I find your new friend!");
    }, 8000);

    // Cleanup timeout when component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Bounce animation effect
  useEffect(() => {
    const bounce = Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 15,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(bounce).start();

    return () => {
      bounceAnim.setValue(0);
    };
  }, []);

  return (
      <View style={styles.big_yu_chat_bubble_container}>
        <View style={styles.chatBubble}>
          <Text style={styles.big_yu_text}>{displayText}</Text>
        </View>
        <View style={styles.chatBubbleArrow} />
        <View style={styles.chatBubbleArrowInner} />
        <Animated.Image
          source={require('../assets/images/yu_searching1.png')}
          style={[
            styles.big_yu_question_onboarding,
            {
              transform: [{ translateY: bounceAnim }],
            },
          ]}
          resizeMode='contain'
        />
      </View>
  );
};

const styles = StyleSheet.create({
  big_yu_chat_bubble_container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  chatBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    width: '76%',
    marginBottom: 0,
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
    borderTopColor: '#ccc',
    alignSelf: 'center',
    marginTop: -2,
  },
  big_yu_question_onboarding: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  big_yu_text: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#42ade2',
    fontSize: 16,
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
    borderTopColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: -17,
  },
});

export default BigYuSearching;
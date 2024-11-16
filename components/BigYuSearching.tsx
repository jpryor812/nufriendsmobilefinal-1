import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Animated, Easing } from 'react-native';

const BigYuSearching = ({ text }: { text: string }) => {
  // Remove the displayText state and use the text prop directly
  
  // Use useRef for the animated value to prevent recreation on rerenders
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Only handle bounce animation
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
          <Text style={styles.big_yu_text}>{text}</Text>
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
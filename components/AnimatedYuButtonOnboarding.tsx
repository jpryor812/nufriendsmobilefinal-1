import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Image, Text, View } from 'react-native';

const AnimatedYuButton = ({ onPress }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // Add this for emoji fade

  useEffect(() => {

    Animated.sequence([
        Animated.delay(1500), // Wait 1.5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();

    const bounceAnimation = Animated.sequence([
      // First bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
      // 4 second delay
      Animated.delay(1500),
      // Second bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
      // 2 second delay
      Animated.delay(1500),
      // Third bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
      Animated.delay(1500),
      // Second bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
      Animated.delay(1500),
      // Second bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
      Animated.delay(1500),
      // Second bounce
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]),
    ]);

    bounceAnimation.start();
  }, [bounceAnim]);

  return (
    <TouchableOpacity onPress={onPress}>
     <View>
        <Animated.Text
          style={{
            opacity: fadeAnim,
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          👇
        </Animated.Text>
      <Animated.View
        style={{
          transform: [{ translateY: bounceAnim }],
          height: 44,
          justifyContent: 'center',
          paddingLeft: 12,
          marginTop: 4,
        }}
      >
        <Image 
          source={require('../assets/images/yu_question_onboarding.png')}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
          }}
        />
      </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedYuButton;
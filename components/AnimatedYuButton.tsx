import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Image } from 'react-native';

const AnimatedYuButton = ({ onPress }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
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
      Animated.delay(4000),
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
      // 4 second delay
      Animated.delay(4000),
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
      ])
    ]);

    bounceAnimation.start();
  }, [bounceAnim]);

  return (
    <TouchableOpacity onPress={onPress}>
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
    </TouchableOpacity>
  );
};

export default AnimatedYuButton;
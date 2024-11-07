import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';

const SearchingDots = ({ 
  baseText = "Searching", 
  textStyle = {},
  dotsStyle = {},
  dotCount = 3,
  animationDuration = 750 // Duration for each dot in milliseconds
}) => {
  const [dots, setDots] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let currentDots = '';
    let currentDotCount = 0;
    
    // Create animation sequence for fade in/out
    const createFadeAnimation = () => {
      return Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration / 2,
          useNativeDriver: true,
        })
      ]);
    };

    const animate = () => {
      currentDotCount = (currentDotCount + 1) % (dotCount + 1);
      currentDots = '.'.repeat(currentDotCount);
      setDots(currentDots);
      
      // Reset animation value and start new animation
      fadeAnim.setValue(0);
      createFadeAnimation().start(() => {
        // Continue animation
        if (currentDotCount === dotCount) {
          currentDotCount = 0;
          currentDots = '';
          setDots(currentDots);
        }
        animate();
      });
    };

    animate();

    return () => {
      // Cleanup
      fadeAnim.setValue(0);
    };
  }, [animationDuration, dotCount, fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, textStyle]}>
        {baseText}
        <Animated.Text style={[
          styles.dots,
          dotsStyle,
          { opacity: fadeAnim }
        ]}>
          {dots}
        </Animated.Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 12,
    color: '#8d8d8d',
    textAlign: 'left',
  },
  dots: {
    fontSize: 12,
    color: '#8d8d8d',
  },
});

export default SearchingDots;
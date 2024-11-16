// components/ConfettiEffect.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ConfettiPiece {
  left: number;
  animation: Animated.Value;
  color: string;
}

interface ConfettiEffectProps {
  colors?: string[]; // Optional custom colors
  count?: number; // Optional number of confetti pieces
  duration?: number; // Optional duration in milliseconds
  delay?: number; // Optional maximum random delay
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  colors = ['#FFD700', '#FF69B4', '#7FFFD4', '#FF4500'],
  count = 240,
  duration = 1500,
  delay = 500,
}) => {
  const confettiPieces: ConfettiPiece[] = Array(count).fill(0).map(() => ({
    left: Math.random() * 100,
    animation: new Animated.Value(0),
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  React.useEffect(() => {
    confettiPieces.forEach(piece => {
      Animated.sequence([
        Animated.delay(Math.random() * delay),
        Animated.timing(piece.animation, {
          toValue: 1,
          duration: duration + Math.random() * 1000,
          useNativeDriver: true,
        })
      ]).start();
    });
  }, []);

  return (
    <View style={styles.confettiContainer}>
      {confettiPieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confettiPiece,
            {
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              transform: [{
                translateY: piece.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 800]
                })
              }, {
                rotate: piece.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1)}deg`]
                })
              }]
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  } as const,
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  } as const,
});

export default ConfettiEffect;
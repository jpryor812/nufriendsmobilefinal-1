import React, { useEffect, useRef, useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  View,
  Easing,
} from 'react-native';

interface FindFriendsButtonProps {
  onPress: () => void;
}

const FindFriendsButton: React.FC<FindFriendsButtonProps> = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Wave animation sequence
  const startWaving = () => {
    const waveSequence = Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(rotateValue, {
        toValue: -1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]);

    // Repeat the sequence 5 times and then stop
    Animated.loop(waveSequence, { iterations: 5 }).start(({ finished }) => {
      // Animation is complete, reset to starting position
      rotateValue.setValue(0);
    });
  };

  useEffect(() => {
    startWaving();
  }, []); // Only run once when component mounts

  const rotation = rotateValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPressed && styles.buttonPressed
      ]}
      onPress={() => {
        setIsPressed(true);
        onPress();
      }}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <Text style={[
          styles.buttonText,
          isPressed && styles.buttonTextPressed
        ]}>
          Find My Friends
        </Text>
        <Animated.Image 
          source={require('../assets/images/hand_progress_bar.png')} // Adjust this path to match your image location
          style={[
            styles.handImage,
            { transform: [{ rotate: rotation }] }
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginHorizontal: 70,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#2196F3',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    backgroundColor: '#2196F3',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  buttonTextPressed: {
    color: 'white',
  },
  handImage: {
    height: 24,
    width: 24,
  },
});

export default FindFriendsButton;
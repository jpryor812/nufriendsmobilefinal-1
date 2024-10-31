import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ImageSourcePropType } from 'react-native';
import FriendProfile from './FriendProfile';

interface FriendItem {
  imageSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
}

interface AnimatedListProps {
  friends: FriendItem[];
  startDelay?: number;
  itemDelay?: number;
  onFriendAppear?: () => void;
}

const OnboardingFriendListAnimation: React.FC<AnimatedListProps> = ({ 
    friends, 
    startDelay = 0, 
    itemDelay = 400,
    onFriendAppear 
  }) => {
    const fadeAnims = useRef(friends.map(() => new Animated.Value(0))).current;
  
    useEffect(() => {
      const animateNext = (index: number) => {
        if (index >= friends.length) return;
  
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            onFriendAppear?.();
            setTimeout(() => animateNext(index + 1), itemDelay);
          }
        });
      };
  
      setTimeout(() => animateNext(0), startDelay);
  
      return () => fadeAnims.forEach(anim => anim.setValue(0));
    }, []);
  
    return (
      <View style={styles.container}>
        {friends.map((friend, index) => (
          <Animated.View
            key={index}
            style={[
              styles.itemContainer,
              { opacity: fadeAnims[index] }
            ]}
          >
            <FriendProfile
              imageSource={friend.imageSource}
              name={friend.name}
              onPress={friend.onPress}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  itemContainer: {
    width: '90%',
    marginVertical: 5,
    alignItems: 'flex-start',
    padding: 2,
  },
});

export default OnboardingFriendListAnimation;
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface GroupChatsJoinedProps {
  Chats: number;
  shakeCount: number;
  isLocked: boolean;
}

const GroupChatsJoined: React.FC<GroupChatsJoinedProps> = ({ Chats, shakeCount, isLocked }) => {
  const rendershakeCount = () => {
    return Array(shakeCount).fill(null).map((_, index) => {
      const imagePath = '../assets/images/handshake.png';
      return (
        <Image 
          key={index}
          source={require(imagePath)}
          style={[
            styles.shakeEmoji,
            index > 0 && styles.overlappingShakeEmoji
          ]}
        />
      );
    });
  };

  return (
    <AchievementContainer isLocked={isLocked}>
      <View style={styles.shakeCountContainer}>
        {rendershakeCount()}
      </View>
      <Text style={styles.achievementText}>
        Join/Start {Chats} Group Chat
      </Text>
    </AchievementContainer>
  );
};

const styles = StyleSheet.create({
  shakeCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8, // Helps center the overlapping emojis
  },
  shakeEmoji: {
    width: 30,
    height: 25,
    marginBottom: 4,
  },
  overlappingShakeEmoji: {
    marginLeft: -10, // This creates the overlap effect
  },
  achievementText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#42ade2',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default GroupChatsJoined;
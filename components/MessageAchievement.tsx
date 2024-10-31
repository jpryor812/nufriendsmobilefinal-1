import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface MessageAchievementProps {
    count: number;
    isLocked: boolean;
  }

  const MessageAchievement: React.FC<MessageAchievementProps> = ({ count, isLocked }) => {
    const getEmojiSource = (count: number) => {
      switch(count) {
        case 100: 
          return require('../assets/images/100_emoji.png');
        case 500: 
          return require('../assets/images/500_emoji.jpg');
        case 1000: 
          return require('../assets/images/1000_emoji.png');
        case 10000: 
          return require('../assets/images/10000_emoji.jpg');
        default: 
          return require('../assets/images/100_emoji.png');
      }
    };
  
    return (
      <AchievementContainer isLocked={isLocked}>
        <Image 
          source={getEmojiSource(count)}
          style={styles.achievementEmoji}
        />
        <Text style={styles.achievementText}>
          {count.toLocaleString()} Messages Sent
        </Text>
      </AchievementContainer>
    );
  };

const styles = StyleSheet.create({
    achievementEmoji: {
      width: 30,
      height: 30,
      marginBottom: 4,
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

export default MessageAchievement;
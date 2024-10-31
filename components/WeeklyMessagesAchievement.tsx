import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface WeeklyMessagesAchievementProps {
  Messages: number;
  mailCount: number;
  isLocked: boolean;
}

const WeeklyMessagesAchievement: React.FC<WeeklyMessagesAchievementProps> = ({ Messages, mailCount, isLocked }) => {
  const rendermailCount = () => {
    return Array(mailCount).fill(null).map((_, index) => {
      const imagePath = '../assets/images/mail_emoji.png';
      return (
        <Image 
          key={index}
          source={require(imagePath)}
          style={[
            styles.mailEmoji,
            index > 0 && styles.overlappingMailEmoji
          ]}
        />
      );
    });
  };

  return (
    <AchievementContainer isLocked={isLocked}>
      <View style={styles.mailCountContainer}>
        {rendermailCount()}
      </View>
      <Text style={styles.achievementText}>
        {Messages} Messages Sent in a Week
      </Text>
    </AchievementContainer>
  );
};

const styles = StyleSheet.create({
  mailCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8, // Helps center the overlapping emojis
  },
  mailEmoji: {
    width: 34,
    height: 17,
    marginBottom: 4,
  },
  overlappingMailEmoji: {
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

export default WeeklyMessagesAchievement;
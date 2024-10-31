import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface StreakAchievementProps {
    days: number;
    fireCount: number;
    isLocked: boolean;
  }

  const StreakAchievement: React.FC<StreakAchievementProps> = ({ days, fireCount, isLocked }) => {
    const renderFireEmojis = () => {
      return Array(fireCount).fill(null).map((_, index) => {
        const imagePath = '../assets/images/fire emoji (1).png';
        console.log(`Loading image at path: ${imagePath}`);
        return (
          <Image 
            key={index}
            source={require(imagePath)}
            style={[
              styles.fireEmoji,
              index > 0 && styles.overlappingFireEmoji
            ]}
          />
        );
      });
    };

  return (
    <AchievementContainer isLocked={isLocked}>
      <View style={styles.fireEmojiContainer}>
        {renderFireEmojis()}
      </View>
      <Text style={styles.achievementText}>
        {days}-Day Streak
      </Text>
    </AchievementContainer>
  );
};

const styles = StyleSheet.create({
    fireEmojiContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: -8, // Helps center the overlapping emojis
    },
    fireEmoji: {
      width: 35,
      height: 35,
      marginBottom: 4,
    },
    overlappingFireEmoji: {
      marginLeft: -20, // This creates the overlap effect
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

export default StreakAchievement;
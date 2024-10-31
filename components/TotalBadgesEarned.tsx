import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface TotalBadgesEarnedProps {
  Badges: number;
  trophyCount: number;
  isLocked: boolean;
}

const TotalBadgesEarned: React.FC<TotalBadgesEarnedProps> = ({ Badges, trophyCount, isLocked }) => {
  const rendertrophyCount = () => {
    return Array(trophyCount).fill(null).map((_, index) => {
      const imagePath = '../assets/images/trophy_emoji_progress_bar.png';
      return (
        <Image 
          key={index}
          source={require(imagePath)}
          style={[
            styles.trophyEmoji,
            index > 0 && styles.overlappingMailEmoji
          ]}
        />
      );
    });
  };

  return (
    <AchievementContainer isLocked={isLocked}>
      <View style={styles.mailCountContainer}>
        {rendertrophyCount()}
      </View>
      <Text style={styles.achievementText}>
        {Badges} Badges Earned
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
  trophyEmoji: {
    width: 30,
    height: 30,
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

export default TotalBadgesEarned;
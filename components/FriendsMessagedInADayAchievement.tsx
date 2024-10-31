import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface FriendsMessagedInADayAchievementProps {
  friends: number;
  WavingHand: number;
  isLocked: boolean;
}

const FriendsMessagedInADayAchievement: React.FC<FriendsMessagedInADayAchievementProps> = ({ friends, WavingHand, isLocked }) => {
  const renderWavingHand = () => {
    return Array(WavingHand).fill(null).map((_, index) => {
      const imagePath = '../assets/images/hand_progress_bar.png';
      return (
        <Image 
          key={index}
          source={require(imagePath)}
          style={[
            styles.wavingHandEmoji,
            index > 0 && styles.overlappingWavingHand
          ]}
        />
      );
    });
  };

  return (
    <AchievementContainer isLocked={isLocked}>
      <View style={styles.YuContainer}>
        {renderWavingHand()}
      </View>
      <Text style={styles.achievementText}>
        Message {friends} Friends in a Day
      </Text>
    </AchievementContainer>
  );
};

const styles = StyleSheet.create({
  YuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8, // Helps center the overlapping emojis
  },
  wavingHandEmoji: {
    width: 30,
    height: 30,
    marginBottom: 4,
  },
  overlappingWavingHand: {
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

export default FriendsMessagedInADayAchievement;
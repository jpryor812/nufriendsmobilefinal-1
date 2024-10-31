import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface YuUseAchievementProps {
  requests: number;
  YuCount: number;
  isLocked: boolean;
}

const YuUseAchievement: React.FC<YuUseAchievementProps> = ({ requests, YuCount, isLocked }) => {
  const renderYu = () => {
    return Array(YuCount).fill(null).map((_, index) => {
      const imagePath = '../assets/images/Yu_excited_no_speech.png';
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
        {renderYu()}
      </View>
      <Text style={styles.achievementText}>
        Use Yu {requests} Times
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

export default YuUseAchievement;
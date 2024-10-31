import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import AchievementContainer from './AchievementContainer';

interface MysteryAchievementsProps {
  Mystery: number;
  QuestionMark: number;
  isLocked: boolean;
}

const MysteryAchievements: React.FC<MysteryAchievementsProps> = ({ Mystery, QuestionMark, isLocked }) => {
  const renderQuestionMark= () => {
    return Array(QuestionMark).fill(null).map((_, index) => {
      const imagePath = '../assets/images/question_mark.png';
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
        {renderQuestionMark()}
      </View>
      <Text style={styles.achievementText}>
        Mystery Achievement...
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

export default MysteryAchievements;
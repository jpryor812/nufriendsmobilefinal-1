import React, { ReactNode } from 'react';
import { View, Image } from 'react-native';
import styles from './AchievementsStyles';  

interface AchievementContainerProps {
  children: ReactNode;
  isLocked: boolean;
  // Add this prop to control whether to show the line
  showLine?: boolean; 
}

const AchievementContainer: React.FC<AchievementContainerProps> = ({ 
  children, 
  isLocked,
  showLine = true // Default to true unless specified otherwise
}) => {
  return (
      <View style={[
        styles.achievementContainer,
        isLocked ? styles.achievementLocked : styles.achievementSuccess
      ]}>
        {!isLocked && (
          <Image 
            source={require('../assets/images/trophy_emoji_progress_bar.png')}
            style={styles.trophyIcon}
          />
        )}
        {children}
      </View>
  );
};

export default AchievementContainer;
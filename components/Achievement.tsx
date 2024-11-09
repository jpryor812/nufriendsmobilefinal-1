// Achievement.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AchievementProps {
  title: string;
  emoji: string;
  isUnlocked: boolean;
  size?: number;
}

const Achievement: React.FC<AchievementProps> = ({ 
  title, 
  emoji, 
  isUnlocked, 
  size = 90 
}) => {
  const backgroundColor = isUnlocked ? '#FFD700' : '#D3D3D3';
  
  return (
    <View style={styles.achievementContainer}>
      <View style={[styles.badgeWrapper, { width: size }]}>
        {/* Main badge body */}
        <View style={[
          styles.achievementBadgeTop,
          { 
            width: size,
            height: size,
            backgroundColor
          }
        ]}>
          <View style={styles.contentContainer}>
            <Text style={[
              styles.emoji,
              { opacity: isUnlocked ? 1 : 0.3 }
            ]}>
              {emoji}
            </Text>
            <Text style={[
              styles.achievementTitle,
              { opacity: isUnlocked ? 1 : 0.3 }
            ]}>
              {title}
            </Text>
          </View>
        </View>
        {/* Softened triangle bottom */}
        <View style={[
          styles.triangleBottom,
          { 
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderTopWidth: size / 4,
            borderTopColor: backgroundColor,
            borderRadius: 8,
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeWrapper: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementBadgeTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15, // Add some padding to push emoji up and text down
  },
  triangleBottom: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 30,
    marginBottom: 10, // Space between emoji and text
  },
  achievementTitle: {
    textAlign: 'center',
    fontSize: 12, // Made slightly smaller to fit better
    color: '#333',
    paddingHorizontal: 5, // Added padding for text wrapping
  },
});

export default Achievement;
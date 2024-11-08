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
  size = 80 
}) => (
  <View style={styles.achievementContainer}>
    <View style={[
      styles.achievementBadge,
      { 
        width: size, 
        height: size,
        backgroundColor: isUnlocked ? '#FFD700' : '#D3D3D3'
      }
    ]}>
      <Text style={[
        styles.emoji,
        { opacity: isUnlocked ? 1 : 0.3 }
      ]}>
        {emoji}
      </Text>
    </View>
    <Text style={styles.achievementTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementBadge: {
    borderRadius: 40,
    justifyContent: 'center',
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
  emoji: {
    fontSize: 30,
  },
  achievementTitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
});

export default Achievement;
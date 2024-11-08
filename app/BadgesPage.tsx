import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Achievement from '../components/Achievement';
import CurvedConnector from '../components/CurvedConnector';
import FooterNavigation from '@/components/FooterNavigation';


interface Achievement {
    id: number;
    title: string;
    emoji: string;
    isUnlocked: boolean;
  }

const BadgesPage: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'Welcome to nufriends',
      emoji: '🌐',
      isUnlocked: true,
    },
    {
      id: 2,
      title: 'Taking the First Step',
      emoji: '🎯',
      isUnlocked: true,
    },
    {
      id: 3,
      title: 'Yu and You',
      emoji: '👥',
      isUnlocked: false,
    },
    {
      id: 4,
      title: 'The start of something special',
      emoji: '✨',
      isUnlocked: false,
    },
    {
      id: 5,
      title: 'Is that easy?',
      emoji: '🎮',
      isUnlocked: false,
    },
    {
      id: 6,
      title: 'Talk to you tomorrow',
      emoji: '👋',
      isUnlocked: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
      <Text style={styles.header}>Badges</Text>
      
      <Text style={styles.levelHeader}>Level One</Text>
      
      <View style={styles.achievementsContainer}>
        {achievements.map((achievement, index) => (
          <View key={achievement.id}>
            <Achievement
              title={achievement.title}
              emoji={achievement.emoji}
              isUnlocked={achievement.isUnlocked}
            />
            {index < achievements.length - 1 && (
              <CurvedConnector direction={index % 2 === 0 ? 'right' : 'left'} />
            )}
          </View>
        ))}
      </View>
        </ScrollView>
      <FooterNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  levelHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  achievementsContainer: {
    alignItems: 'center',
  },
});

export default BadgesPage;
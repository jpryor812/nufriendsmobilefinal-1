// BadgesPage.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Achievement from '../components/Achievement';
import CurvedConnector from '../components/CurvedConnector';
import FooterNavigation from '@/components/FooterNavigation';
import { Achievement as AchievementType, getBadgesByLevel } from '../constants/Badges';

const BadgesPage: React.FC = () => {
  const levelOneBadges = getBadgesByLevel(1);
  const levelTwoBadges = getBadgesByLevel(2);

  const renderBadgeLevel = (badges: AchievementType[], levelNumber: number) => {
    // Early return if we don't have enough badges
    if (badges.length < 5) return null;

    return (
      <View key={levelNumber}>
        <Text style={styles.levelHeader}>Level {levelNumber}</Text>
        <View style={styles.levelContainer}>
          {/* Top row - single badge */}
          <View style={styles.topRow}>
            <Achievement
              title={badges[0].title}
              emoji={badges[0].emoji}
              isUnlocked={badges[0].isUnlocked}
            />
          </View>

          {/* Middle row - two badges */}
          <View style={styles.middleRow}>
            <View style={styles.badgePair}>
              <Achievement
                title={badges[1].title}
                emoji={badges[1].emoji}
                isUnlocked={badges[1].isUnlocked}
              />
              <Achievement
                title={badges[2].title}
                emoji={badges[2].emoji}
                isUnlocked={badges[2].isUnlocked}
              />
            </View>
          </View>

          {/* Bottom row - two badges */}
          <View style={styles.bottomRow}>
            <View style={styles.badgePair}>
              <Achievement
                title={badges[3].title}
                emoji={badges[3].emoji}
                isUnlocked={badges[3].isUnlocked}
              />
              <Achievement
                title={badges[4].title}
                emoji={badges[4].emoji}
                isUnlocked={badges[4].isUnlocked}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Badges</Text>
        {renderBadgeLevel(levelOneBadges, 1)}
        {renderBadgeLevel(levelTwoBadges, 2)}
      </ScrollView>
      <FooterNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContainer: {
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
  levelContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  topRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  middleRow: {
    marginBottom: 20,
  },
  bottomRow: {
    marginBottom: 20,
  },
  badgePair: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32, // Use gap if supported in your React Native version
    // If gap isn't supported, use:
    // marginHorizontal: 10, // And add marginHorizontal: 10 to the Achievement component
  },
});

export default BadgesPage;
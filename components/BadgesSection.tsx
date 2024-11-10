// BadgesPage.tsx
import React, {useMemo, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Achievement from './Achievement';
import CurvedConnector from './CurvedConnector';
import FooterNavigation from '@/components/FooterNavigation';
import { Achievement as AchievementType, getBadgesByLevel } from '../constants/Badges';
import CloudOverlay from './CloudOverlay';
import BadgeModal from './BadgeModal';
import Card from './Card';



const BadgesSection = () => {
  const levelOneBadges = getBadgesByLevel(1);
    const levelTwoBadges = getBadgesByLevel(2);
    const levelThreeBadges = getBadgesByLevel(3);
    const levelFourBadges = getBadgesByLevel(4);

    const [selectedBadge, setSelectedBadge] = useState<AchievementType | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const headerBadge = {
        id: 0,
        title: 'Welcome to nufriends',
        imageSource: require('../assets/images/Yu_excited_no_speech.png'),
        isUnlocked: true,
        level: 0, // Special level for header badge
        howToEarn: 'Complete Onboarding'
      };
  
    const handleBadgePress = (badge: AchievementType) => {
        setSelectedBadge(badge);
        setIsModalVisible(true);
      };

      const renderBadgeGroup = (badges: AchievementType[], startIndex: number) => {
        return badges.slice(startIndex, startIndex + 2).map((badge, index) => (
          <Achievement
            key={badge.id}
            title={badge.title}
            emoji={badge.emoji}
            imageSource={badge.imageSource} // Add this line
            isUnlocked={badge.isUnlocked}
            onPress={() => handleBadgePress(badge)}
          />
        ));
      };

      const areAllLevel1BadgesUnlocked = useMemo(() => {
        return levelOneBadges.every(badge => badge.isUnlocked);
      }, [levelOneBadges]);
    
      const areAllLevel2BadgesUnlocked = useMemo(() => {
        return levelTwoBadges.every(badge => badge.isUnlocked);
      }, [levelTwoBadges]);
    
      const areAllLevel3BadgesUnlocked = useMemo(() => {
        return levelThreeBadges.every(badge => badge.isUnlocked);
      }, [levelThreeBadges]);
    
      // Modify renderBadgeLevel to handle all level locks
      const renderBadgeLevel = (badges: AchievementType[], levelNumber: number) => {
        const isLevelLocked = (() => {
          switch (levelNumber) {
            case 2:
              return !areAllLevel1BadgesUnlocked;
            case 3:
              return !areAllLevel1BadgesUnlocked || !areAllLevel2BadgesUnlocked;
            case 4:
              return !areAllLevel1BadgesUnlocked || !areAllLevel2BadgesUnlocked || !areAllLevel3BadgesUnlocked;
            default:
              return false;
          }
        })();

    return (
      <View key={levelNumber}>
        <Text style={styles.levelHeader}>Level {levelNumber}</Text>
        <View style={styles.levelContainer}>
          {/* Top row - single badge */}
          <View style={styles.topRow}>
            <Achievement
              title={badges[0].title}
              emoji={badges[0].emoji}
              imageSource={badges[0].imageSource} // Add this line
              isUnlocked={badges[0].isUnlocked}
              onPress={() => handleBadgePress(badges[0])}
            />
          </View>

          {/* Middle row - two badges */}
          <View style={styles.middleRow}>
            <View style={styles.badgePair}>
              <Achievement
                title={badges[1].title}
                emoji={badges[1].emoji}
                imageSource={badges[1].imageSource} // Add this line
                isUnlocked={badges[1].isUnlocked}
                onPress={() => handleBadgePress(badges[1])}
              />
              <Achievement
                title={badges[2].title}
                emoji={badges[2].emoji}
                imageSource={badges[2].imageSource} // Add this line
                isUnlocked={badges[2].isUnlocked}
                onPress={() => handleBadgePress(badges[2])}
              />
            </View>
          </View>

          {/* Bottom row - two badges */}
          <View style={styles.bottomRow}>
            <View style={styles.badgePair}>
              <Achievement
                title={badges[3].title}
                emoji={badges[3].emoji}
                imageSource={badges[3].imageSource} // Add this line
                isUnlocked={badges[3].isUnlocked}
                onPress={() => handleBadgePress(badges[3])}
              />
              <Achievement
                title={badges[4].title}
                emoji={badges[4].emoji}
                imageSource={badges[4].imageSource} // Add this line
                isUnlocked={badges[4].isUnlocked}
                onPress={() => handleBadgePress(badges[4])}
              />
            </View>
          </View>
          <CloudOverlay 
          isLocked={isLevelLocked} 
          level={levelNumber} // Add this prop
        />
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>Badges</Text>
        <Text style={styles.levelHeader}>Onboarding</Text>
        <View style={styles.headerBadgeContainer}>
          <Achievement
            title={headerBadge.title}
            imageSource={headerBadge.imageSource}
            isUnlocked={headerBadge.isUnlocked}
            onPress={() => handleBadgePress(headerBadge)}
            size={110} // Slightly larger for emphasis
          />
        </View>
        {renderBadgeLevel(levelOneBadges, 1)}
        {renderBadgeLevel(levelTwoBadges, 2)}
        {renderBadgeLevel(levelThreeBadges, 3)}
        {renderBadgeLevel(levelFourBadges, 4)}
      </ScrollView>
      <BadgeModal
        visible={isModalVisible}
        badge={selectedBadge}
        onClose={() => setIsModalVisible(false)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
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
    gap: 36, // Use gap if supported in your React Native version
    // If gap isn't supported, use:
    // marginHorizontal: 10, // And add marginHorizontal: 10 to the Achievement component
  },
  headerBadgeContainer: {
    alignItems: 'center',
    marginBottom: 40, // More space between header badge and first level
    paddingHorizontal: 20,
  },
});

export default BadgesSection;
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Achievement from './Achievement';
import Card from './Card';
import BadgeModal from './BadgeModal';
import { badges, Achievement as AchievementType } from '../constants/FriendBadges'; // Update this path


const BadgesSection = () => {
  const [selectedBadge, setSelectedBadge] = useState<AchievementType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBadgePress = (badge: AchievementType) => {
    setSelectedBadge(badge);
    setIsModalVisible(true);
  };

  const renderBadgeRows = () => {
    const rows = [];
    for (let i = 0; i < badges.length; i += 2) {
      const rowBadges = badges.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.badgeRow}>
          {rowBadges.map((badge) => (
            <Achievement
              key={badge.id}
              title={badge.title}
              emoji={badge.emoji}
              imageSource={badge.imageSource}
              isUnlocked={badge.isUnlocked}
              onPress={() => handleBadgePress(badge)}
              size={110} // Add this line - adjust the number to your desired size
            />
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {renderBadgeRows()}
      </ScrollView>
      <BadgeModal
        visible={isModalVisible}
        badge={selectedBadge}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    width: '100%',
  },
});

export default BadgesSection;
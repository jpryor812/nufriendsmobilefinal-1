import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform 
} from 'react-native';
import Achievement from './Achievement';
import BadgeCard from './BadgeCard';
import BadgeModal from './BadgeModal';
import { badges, Achievement as AchievementType } from '../constants/FriendBadges';
import ScrollSafeLayout from './ScrollSafeLayout';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const BadgesSection = () => {
  const [selectedBadge, setSelectedBadge] = useState<AchievementType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? 0 : -SCREEN_HEIGHT * 0.4,
      useNativeDriver: true,
      tension: 20,
      friction: 7
    }).start();
    
    setIsExpanded(!isExpanded);
  };

    const handleBadgePress = (badge: AchievementType) => {
    setSelectedBadge(badge);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBadge(null);
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
              size={102}
            />
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.outerContainer}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateY: slideAnim }],
            zIndex: isExpanded ? 999 : 1,
          }
        ]}
      >
        <BadgeCard style={[styles.card, isExpanded && styles.expandedCard]}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Badges</Text>
            <TouchableOpacity onPress={toggleExpand}>
              <Ionicons 
                name={isExpanded ? "chevron-down" : "chevron-up"} 
                size={24} 
                color="#333" 
              />
            </TouchableOpacity>
          </View>
          
          <ScrollSafeLayout 
            style={[
              styles.scrollContainer,
              isExpanded && styles.expandedScrollContainer
            ]}
          >
            {renderBadgeRows()}
          </ScrollSafeLayout>
        </BadgeCard>
      </Animated.View>

      <BadgeModal
        visible={isModalVisible}
        badge={selectedBadge}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: 250, // Initial height of badge section
    backgroundColor: '#f0f8ff',
    zIndex: 1,
  },
  animatedContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#f0f8ff', // Add here too
    minHeight: 250,
  },
  card: {
    borderRadius: 10,
  },
  expandedCard: {
    height: SCREEN_HEIGHT * 0.6,
    zIndex: 100001, // Even higher z-index when expanded
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  scrollContainer: {
    height: 180,
  },
  expandedScrollContainer: {
    height: SCREEN_HEIGHT * 0.6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default BadgesSection;
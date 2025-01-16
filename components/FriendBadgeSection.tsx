import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import Achievement from './Achievement';
import BadgeCard from './BadgeCard';
import BadgeModal from './BadgeModal';
import ScrollSafeLayout from './ScrollSafeLayout';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatars, achievementAvatars } from '@/constants/avatars';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BadgesSectionProps {
  unlockedItems?: string[];
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ unlockedItems = [] }) => {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
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

  const renderAvatarPairs = () => {
    const pairs = defaultAvatars
      .filter((_, i) => i % 2 === 0)
      .map((_, index) => ({
        regularAvatar: defaultAvatars[index * 2],
        premiumAvatar: defaultAvatars[index * 2 + 1],
        requirementText: 'Default Avatars',
        isUnlocked: true
      }))
      .concat(
        achievementAvatars
          .filter((_, i) => i % 2 === 0)
          .map((_, index) => ({
            regularAvatar: achievementAvatars[index * 2],
            premiumAvatar: achievementAvatars[index * 2 + 1],
            requirementText: achievementAvatars[index * 2].requirementText || '',
            isUnlocked: unlockedItems.includes(achievementAvatars[index * 2].id)
          }))
      );

    return pairs.map((pair, index) => (
      <View key={index} style={styles.badgeRow}>
        <Achievement
          regularAvatar={pair.regularAvatar}
          premiumAvatar={pair.premiumAvatar}
          requirementText={pair.requirementText}
          isUnlocked={pair.isUnlocked}
          onPress={() => {
            setSelectedBadge(pair);
            setIsModalVisible(true);
          }}
          size={102}
        />
      </View>
    ));
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
            {renderAvatarPairs()}
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
    height: 250,
    backgroundColor: '#f0f8ff',
    zIndex: 1,
  },
  animatedContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#f0f8ff',
    minHeight: 250,
  },
  card: {
    borderRadius: 10,
  },
  expandedCard: {
    height: SCREEN_HEIGHT * 0.6,
    zIndex: 100001,
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
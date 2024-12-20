// components/AchievementBadge.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AchievementBadgeProps {
  regularAvatar: {
    id: string;
    image: any;
  };
  premiumAvatar: {
    id: string;
    image: any;
  };
  requirementText: string;
  isUnlocked: boolean;
  size?: number;
}

// Change to default export
const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  regularAvatar,
  premiumAvatar,
  requirementText,
  isUnlocked,
  size = 110,
}) => {
  const gradientColors = isUnlocked 
    ? ['#FFE875', '#FEC417']
    : ['#E3E3E3', '#A9A9A9'];

  return (
    <TouchableOpacity>
      <View style={styles.achievementContainer}>
        <View style={[styles.badgeWrapper, { width: size }]}>
          <LinearGradient
            colors={gradientColors}
            style={[
              styles.achievementBadgeTop,
              { 
                width: size,
                height: size,
              }
            ]}
          >
            <View style={styles.contentContainer}>
              <View style={styles.avatarsContainer}>
                <Image 
                  source={regularAvatar.image}
                  style={[
                    styles.avatar,
                    { opacity: isUnlocked ? 1 : 0.3 }
                  ]}
                  resizeMode="contain"
                />
                <View style={styles.premiumContainer}>
                  <Image 
                    source={premiumAvatar.image}
                    style={[
                      styles.avatar,
                      { opacity: isUnlocked ? 1 : 0.3 }
                    ]}
                    resizeMode="contain"
                  />
                  <Text style={styles.starBadge}>⭐</Text>
                </View>
              </View>
              <Text style={[
                styles.requirementText,
                { opacity: isUnlocked ? 1 : 0.3 }
              ]}>
                {requirementText}
              </Text>
            </View>
          </LinearGradient>

          <View style={[styles.triangleContainer, { width: size }]}>
            <View style={[
              styles.triangle,
              { 
                borderTopColor: isUnlocked ? '#FEC417' : '#A9A9A9',
                borderLeftWidth: size / 2,
                borderRightWidth: size / 2,
                borderTopWidth: size / 4,
              }
            ]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  achievementContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  badgeWrapper: {
    alignItems: 'center',
  },
  achievementBadgeTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  premiumContainer: {
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 16,
    color: '#fff',
  },
  requirementText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    paddingHorizontal: 10,
  },
  triangleContainer: {
    height: 0,
    alignItems: 'center',
    marginTop: -1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

export default AchievementBadge;
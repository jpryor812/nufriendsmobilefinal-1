import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AchievementProps {
  regularAvatar: {
    id: string;
    image: ImageSourcePropType;
  };
  premiumAvatar: {
    id: string;
    image: ImageSourcePropType;
  };
  requirementText: string;
  isUnlocked: boolean;
  size?: number;
  onPress?: () => void;
}

const Achievement: React.FC<AchievementProps> = ({ 
  regularAvatar,
  premiumAvatar,
  requirementText,
  isUnlocked, 
  size = 110,
  onPress
}) => {
  const gradientColors = isUnlocked 
    ? ['#FFE875', '#FEC417']
    : ['#E3E3E3', '#A9A9A9'];
  
  return (
    <TouchableOpacity onPress={onPress}>
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
                <View style={styles.premiumAvatarContainer}>
                  <Image 
                    source={premiumAvatar.image}
                    style={[
                      styles.avatar,
                      { opacity: isUnlocked ? 1 : 0.3 }
                    ]}
                    resizeMode="contain"
                  />
                  <Text style={styles.starBadge}>🌟</Text>
                </View>
              </View>
              
              <Text style={[
                styles.achievementTitle,
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
    marginHorizontal: 10,
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  premiumAvatarContainer: {
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 14,
    color: '#fff',
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
    paddingVertical: 12,
  },
  triangleContainer: {
    height: 0,
    alignItems: 'center',
    marginTop: -1,
    ...Platform.select({
      android: {
        paddingTop: 0, // Fix for Android rendering
      }
    }),
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FEC417',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 2,
  },
  achievementTitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  badgeImage: {},
});

export default Achievement;
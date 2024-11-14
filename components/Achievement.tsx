import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AchievementProps {
  title: string;
  emoji?: string;
  imageSource?: ImageSourcePropType;
  isUnlocked: boolean;
  size?: number;
  onPress?: () => void;
}

const Achievement: React.FC<AchievementProps> = ({ 
  title, 
  emoji, 
  imageSource,
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
              {imageSource ? (
                <Image 
                  source={imageSource}
                  style={[
                    styles.badgeImage,
                    { 
                      width: size * 0.5,
                      height: size * 0.5,
                      opacity: isUnlocked ? 1 : 0.3
                    }
                  ]}
                  resizeMode="contain"
                />
              ) : (
                <Text style={[
                  styles.emoji,
                  { opacity: isUnlocked ? 1 : 0.3 }
                ]}>
                  {emoji}
                </Text>
              )}
              
              <Text style={[
                styles.achievementTitle,
                { opacity: isUnlocked ? 1 : 0.3 }
              ]}>
                {title}
              </Text>
            </View>
          </LinearGradient>

          {/* New triangle implementation */}
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
    marginBottom: 10,
  },
  achievementTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  badgeImage: {},
});

export default Achievement;
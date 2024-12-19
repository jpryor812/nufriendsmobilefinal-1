// AchievementsPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { achievementPairs } from '@/constants/avatarData';
import Card from '@/components/Card';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import Achievement from '@/components/Achievement';

const AchievementBadge = ({ 
  regularAvatar, 
  premiumAvatar, 
  requirementText, 
  isUnlocked 
}: {
  regularAvatar: { id: string; image: any };
  premiumAvatar: { id: string; image: any };
  requirementText: string;
  isUnlocked: boolean;
}) => (
  <View style={styles.badge}>
    <View style={styles.avatarsContainer}>
      <Image 
        source={regularAvatar.image}
        style={[styles.avatar, !isUnlocked && styles.lockedAvatar]}
        resizeMode="contain"
      />
      <View style={styles.premiumContainer}>
        <Image 
          source={premiumAvatar.image}
          style={[styles.avatar, !isUnlocked && styles.lockedAvatar]}
          resizeMode="contain"
        />
        <Text style={styles.starBadge}>⭐</Text>
      </View>
    </View>
    <Text style={styles.requirementText}>{requirementText}</Text>
  </View>
);

const AchievementsPage = () => {
  const { user } = useAuth();
  const [messageCount, setMessageCount] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUnlockedItems(userData?.avatar?.unlockedItems || []);
        setMessageCount(userData?.stats?.messagesSent || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  return (
    <ScrollSafeLayout style={styles.container}>
    <Card>
      <View style={styles.messageCountContainer}>
        <Text style={styles.messageCount}>Messages Sent: {messageCount}</Text>
      </View>

      <View style={styles.badgesGrid}>
        {achievementPairs.map((pair) => (
          <Achievement
            key={pair.regularAvatar.id}
            regularAvatar={pair.regularAvatar}
            premiumAvatar={pair.premiumAvatar}
            requirementText={pair.requirementText}
            isUnlocked={messageCount >= pair.messageCount}
            onPress={() => console.log('Badge pressed')}
          />
        ))}
      </View>
    </Card>
  </ScrollSafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageCountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  messageCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  badge: {
    width: 160,
    height: 160,
    backgroundColor: 'white',
    borderRadius: 80,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  lockedAvatar: {
    opacity: 0.3,
    tintColor: '#000',
  },
  premiumContainer: {
    position: 'relative',
  },
  starBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 16,
  },
  requirementText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginTop: 15,
    paddingHorizontal: 5,
  },
});

export default AchievementsPage;
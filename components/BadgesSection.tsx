// components/BadgesSection.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { defaultAvatarPairs, achievementAvatarPairs } from '@/constants/avatarData';
import AchievementBadge from '@/components/AchievementBadge';
import Card from '@/components/Card';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';

const BadgesSection = () => {
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
    <Card style={styles.container}>
      <ScrollSafeLayout style={styles.scrollContainer}>
        <Text style={styles.messageCount}>Messages Sent: {messageCount}</Text>

        {/* Default Avatars Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Avatars</Text>
          <View style={styles.badgesGrid}>
            {defaultAvatarPairs.map((pair) => (
              <AchievementBadge
                key={pair.regularAvatar.id}
                regularAvatar={pair.regularAvatar}
                premiumAvatar={pair.premiumAvatar}
                requirementText={pair.requirementText}
                isUnlocked={true} // Always unlocked
                size={160}
              />
            ))}
          </View>
        </View>

        {/* Achievement Avatars Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Avatars</Text>
          <View style={styles.badgesGrid}>
            {achievementAvatarPairs.map((pair) => (
              <AchievementBadge
                key={pair.regularAvatar.id}
                regularAvatar={pair.regularAvatar}
                premiumAvatar={pair.premiumAvatar}
                requirementText={pair.requirementText}
                isUnlocked={messageCount >= (pair.messageCount || 0)}
                size={160}
              />
            ))}
          </View>
        </View>
      </ScrollSafeLayout>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  messageCount: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
});

export default BadgesSection;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { defaultAvatarPairs, achievementAvatarPairs } from '@/constants/avatarData';
import Card from '@/components/Card';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import AchievementBadge from '@/components/AchievementBadge';

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

    {/* Default Avatars Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Unlocked Achievements</Text>
      <View style={styles.badgesGrid}>
        {defaultAvatarPairs.map((pair) => (
          <AchievementBadge
            key={pair.regularAvatar.id}
            regularAvatar={pair.regularAvatar}
            premiumAvatar={pair.premiumAvatar}
            requirementText={pair.requirementText}
            isUnlocked={true} // Always unlocked
          />
        ))}
      </View>
    </View>

    {/* Achievement Avatars Section */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Locked Achievements</Text>
      <View style={styles.badgesGrid}>
        {achievementAvatarPairs.map((pair) => (
          <AchievementBadge
            key={pair.regularAvatar.id}
            regularAvatar={pair.regularAvatar}
            premiumAvatar={pair.premiumAvatar}
            requirementText={pair.requirementText}
            isUnlocked={messageCount >= (pair.messageCount || 0)}
          />
        ))}
      </View>
    </View>
  </Card>
</ScrollSafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 60, 
    backgroundColor: '#F0FCFE',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});

export default AchievementsPage;
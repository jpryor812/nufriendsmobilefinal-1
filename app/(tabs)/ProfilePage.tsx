import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { avatarStyles } from '@/constants/avatarData';
import HeaderButtons from '../../components/HeaderButtons';
import FriendProfileVertical from '../../components/FriendProfileVertical';
import MessagesChart from '../../components/MessagesChart';
import ActiveStreaks from '../../components/ActiveStreaks';
import StatsBar from '../../components/UserStatsContainer';
import BadgesSection from '../../components/BadgesSection';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import SafeLayout from '@/components/SafeLayout';
import AccountManagement from '../AccountManagement';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentAvatar, setCurrentAvatar] = useState<any>(null);
  const [username, setUsername] = useState<string>("");

  const handleFindFriends = () => {
    console.log('Find friends');
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
  };

  const handleSettingsPress = () => {
    router.push('/Settings');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        // Get current avatar
        const currentOutfitId = userData?.avatar?.currentOutfit?.id;
        if (currentOutfitId) {
          const avatar = avatarStyles.find(a => a.id === currentOutfitId);
          if (avatar) {
            setCurrentAvatar(avatar.image);
          }
        }

        // Get username
        if (userData?.username) {
          setUsername(userData.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  return (
    <SafeLayout style={styles.container} hasTabBar>
      <ScrollSafeLayout 
        hasTabBar
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <HeaderButtons 
          onPressFindFriends={handleFindFriends}
          onPressUpgrade={handleUpgrade}
        />
        <View style={styles.settingsContainer}>
                <TouchableOpacity 
                onPress={handleSettingsPress}
                style={styles.settingsButton}
              >
                <Ionicons name="settings-outline" size={24} color="#333" />
              </TouchableOpacity>
        </View>
        <View style={styles.friendProfileContainer}>
      <FriendProfileVertical 
        imageSource={currentAvatar || require('../../assets/avatars/avatar_default.png')}
        name={username || "User"}
        onPress={() => console.log('Friend profile pressed')}
      />
    </View>
        <View style={styles.chartContainer}>
          <MessagesChart />
        </View>
        <StatsBar currentWeek={0} />
        <ActiveStreaks />
        <BadgesSection /> 
      </ScrollSafeLayout>
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#F0FCFE',
  },
  friendProfileContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#F0FCFE',
  },
  settingsButton: {
    right: 16,
    marginLeft: 'auto', // This will push the button to the right
  },
  settingsContainer: {
    marginTop: -2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default ProfilePage;
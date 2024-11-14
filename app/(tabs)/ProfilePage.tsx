import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderButtons from '../../components/HeaderButtons';
import FriendProfileVertical from '../../components/FriendProfileVertical';
import MessagesChart from '../../components/MessagesChart';
import ActiveStreaks from '../../components/ActiveStreaks';
import StatsBar from '../../components/UserStatsContainer';
import AchievementsSection from '@/components/AchievementsSection';
import BadgesSection from '../../components/BadgesSection';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import SafeLayout from '@/components/SafeLayout';

const ProfilePage = () => {
  const handleFindFriends = () => {
    console.log('Find friends');
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
  };

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
        <View style={styles.friendProfileContainer}>
          <FriendProfileVertical 
            imageSource={require('../../assets/images/profile_picture.jpg')} 
            name="Jpp123" 
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
});

export default ProfilePage;
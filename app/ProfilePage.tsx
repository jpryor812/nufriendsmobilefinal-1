import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import FriendProfileVertical from '../components/FriendProfileVertical';
import DatingToggle from '../components/DatingToggle';
import MessagesChart from '../components/MessagesChart';
import ActiveStreaks from '../components/ActiveStreaks';
import StatsBar from '../components/UserStatsContainer';
import AchievementsSection from '@/components/AchievementsSection';
import FooterNavigation from '../components/FooterNavigationIOS';
import FooterNavigationAndroid from '@/components/FooterNavigationAndroid';
import BadgesSection from '../components/BadgesSection';
import SafeLayout from '@/components/SafeLayout';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';

const ProfilePage = () => {

  const handleFindFriends = () => {
    console.log('Find friends');
  };

  const handleUpgrade = () => {
    console.log('Upgrade');
  };

  const FooterNavigation = () => {
    return Platform.OS === 'ios' ? <FooterNavigation /> : <FooterNavigationAndroid />;
  };

  return (
    <SafeLayout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <HeaderButtons 
          onPressFindFriends={handleFindFriends}
          onPressUpgrade={handleUpgrade}
        />
        <View style={styles.friendProfileContainer}>
          <FriendProfileVertical 
            imageSource={require('../assets/images/profile_picture.jpg')} 
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
      </ScrollView>
      <FooterNavigation />
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE', // Match your app's background color
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#F0FCFE', // Match your app's background color
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
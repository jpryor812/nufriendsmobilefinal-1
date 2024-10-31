import React from 'react';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import HeaderButtons from '../components/HeaderButtons';
import MessageList from '../components/MessagesList';
import FooterNavigation from '../components/FooterNavigation';
import { Link } from "expo-router";

// Add type for navigation if using TypeScript
const HomePage = () => {

  const handleFindFriends = () => {
    console.log('Find New Friends pressed');
  };

  const handleUpgrade = () => {
    console.log('Upgrade to Premium pressed');
  };

  const handleSeeMore = () => {
    console.log("See More pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderButtons 
        onPressFindFriends={handleFindFriends}
        onPressUpgrade={handleUpgrade}
      />
      <View style={styles.introContainer}>
        <Link href={"/OnboardingPage1"} style={styles.seeMoreLink}>
          <Text style={styles.seeMore}>Onboarding</Text>
        </Link>
        <Text style={styles.welcomeBackMessage}>
          Welcome back, Justin! You've made 4 new friends and sent 123 messages this week!
        </Text>
        <Link href={"/ProfilePage"} style={styles.seeMoreLink}>
          <Text style={styles.seeMore}>See More</Text>
        </Link>
      </View>    
      <View style={styles.messageContainer}>
        <MessageList />
      </View>
      <FooterNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  introContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  welcomeBackMessage: {
    fontStyle: 'italic',
    fontSize: 13,
    color: '#9d9d9d',
    marginTop: 10,
  },
  seeMoreLink: {
    alignSelf: 'flex-end',
  },
  seeMore: {
    textDecorationLine: 'underline',
    fontSize: 13,
    color: '#9d9d9d',
    marginBottom: 5,
  },
  messageContainer: {
    flex: 1,
  }
});

export default HomePage;
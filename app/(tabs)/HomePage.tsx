import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HeaderButtons from '../../components/HeaderButtons';
import MessageList from '../../components/MessagesList';
import { Link } from "expo-router";
import SafeLayout from '@/components/SafeLayout';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';

const HomePage = () => {
  const handleSeeMore = () => {
  };

  return (
    <SafeLayout style={styles.container} hasTabBar>
        <HeaderButtons 
          onPressUpgrade={() => {
            throw new Error('Function not implemented.');
          }} 
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
    </SafeLayout>
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
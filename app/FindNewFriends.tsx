import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import CountryDropdown from '../components/CountryDropdown';
import GenderDropdown from '../components/GenderDropdown';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import FooterNavigation from '@/components/FooterNavigation';

const FindNewFriends = () => {
  const router = useRouter();

  const handleCitiesChange = (cities: string[]) => {
    console.log('Selected cities:', cities);
  };

  const handleStatesChange = (states: string[]) => {
    console.log('Selected states:', states);
  };

  const handleCountriesChange = (countries: string[]) => {
    console.log('Selected countries:', countries);
  };

  const handleGendersChange = (genders: string[]) => {
    console.log('Selected genders:', genders);
  };

  const handlePress = () => {
    console.log('Find New Friends pressed');
  };

  const handleFindFriends = () => {
    router.push('/FindingFriends');
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
      <Text style={styles.PageTitle}>Find Your New Friend!!</Text>
      <Text style={styles.PageSubTitle}>Feel free to use the filters to look for specific friends or just search anywhere!</Text>
      <Text style={styles.PageSubSubTitle}>Note: The broader your search, the quicker you'll find friends! Also, We only show options as they relate to our active users so you may not see every possible option. We update this weekly.</Text>
      <View style={styles.dropdownsContainer}>
        <CityDropdown onCitiesChange={handleCitiesChange} />
        <StateDropdown onStatesChange={handleStatesChange} />
        <CountryDropdown onCountriesChange={handleCountriesChange} />
        <GenderDropdown onGendersChange={handleGendersChange} />
        <FindFriendsButton onPress={handleFindFriends} />
        <View style={styles.introContainer}>
          <Text style={styles.Announcement}>As a FREE user, you can find one new friend every 24 hours. Upgrade to get 4x as many friends!!</Text>
          <FindMoreFriendsButton onPress={handlePress} />
        </View>
      </View>
      </ScrollView>
      <View style={styles.footerContainer}>
      <FooterNavigation />
      </View>
    </SafeAreaView>
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
  dropdownsContainer: {
    padding: 20,
    gap: 10,
  },
  introContainer: {
    borderRadius: 30,
    marginTop: 2,
    padding: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  Announcement: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 10,
    marginBottom: 8,
  },
  PageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  PageSubTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  PageSubSubTitle: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#9d9d9d',
    marginHorizontal: 24,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 4,
    marginBottom: -4,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  footerContainer: {
    width: '100%',
    marginTop: 'auto',
  },
});

export default FindNewFriends;
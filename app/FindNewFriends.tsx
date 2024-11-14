import React, {useState} from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import StateDropdownFindFriends from '../components/StateDropdownFindFriends';
import CountryDropdown from '../components/CountryDropdown';
import GenderDropdownFindFriends from '../components/GenderDropdownFindFriends';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import FooterNavigation from '@/components/FooterNavigation';
import SafeLayout from '@/components/SafeLayout';
import { Link } from 'expo-router';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import CityDropdownFindFriends from '@/components/CityDropdownFindFriends';

const FindNewFriends = () => {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [] as string[],
    states: [] as string[],
    countries: [] as string[],
    genders: [] as string[],
  });

  const handleCitiesChange = (cities: string[]) => {
    setSelectedFilters(prev => ({ ...prev, cities }));
  };

  const handleStatesChange = (states: string[]) => {
    console.log('Selected states:', states);
    setSelectedFilters(prev => ({ ...prev, states }));
  };

  const handleCountriesChange = (countries: string[]) => {
    setSelectedFilters(prev => ({ ...prev, countries }));
  };

  const handleGendersChange = (genders: string[]) => {
    setSelectedFilters(prev => ({ ...prev, genders }));
  };

  const handlePress = () => {
    console.log('Find New Friends pressed');
  };

  const handleFindFriends = () => {
    console.log('Filters being passed:', selectedFilters);
    router.push({
      pathname: '/FindingFriends',
      params: {
        filters: JSON.stringify(selectedFilters)
      }
    });
  };



  return (
    <SafeLayout style={styles.container}>
        <Link href="/HomePage" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Link>
      <ScrollView style={styles.scrollContainer}>
      <Text style={styles.PageTitle}>Find Your New Friend!!</Text>
      <Text style={styles.PageSubTitle}>Feel free to use the filters to look for specific friends or just search for anyone anywhere by leaving everything blank!!</Text>
      <Text style={styles.PageSubSubTitle}>Note: The broader your search, the quicker you'll find friends! Also, We only show options as they relate to our active users so you may not see every possible option. We update this weekly.</Text>
      <View style={styles.dropdownsContainer}>
      <GenderDropdownFindFriends onGendersChange={handleGendersChange} />
      <StateDropdownFindFriends onStatesChange={handleStatesChange} />
        <CityDropdownFindFriends onCitiesChange={handleCitiesChange} />
        <FindFriendsButton onPress={handleFindFriends} />
        <View style={styles.introContainer}>
          <Text style={styles.Announcement}>As a FREE user, you can find one new friend every 24 hours. Upgrade to get 4x as many friends!!</Text>
          <FindMoreFriendsButton onPress={handlePress} />
        </View>
      </View>
      </ScrollView>
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
});

export default FindNewFriends;
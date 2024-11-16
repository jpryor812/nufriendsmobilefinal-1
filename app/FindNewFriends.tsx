import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import StateDropdownFindFriends from '../components/StateDropdownFindFriends';
import GenderDropdownFindFriends from '../components/GenderDropdownFindFriends';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import SafeLayout from '@/components/SafeLayout';
import { Link } from 'expo-router';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import CityDropdownFindFriends from '@/components/CityDropdownFindFriends';
import { friendsData } from '../constants/FriendsData';

const FindNewFriends = () => {
  const router = useRouter();
  
  // Selected filters state
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [] as string[],
    states: [] as string[],
    genders: [] as string[],
  });

  // Available options state
  const [availableOptions, setAvailableOptions] = useState({
    genders: [] as string[],
    states: [] as string[],
    cities: [] as string[],
  });

  const [noMatchesError, setNoMatchesError] = useState<string | null>(null);

  // Initialize available genders on component mount
  useEffect(() => {
    const uniqueGenders = [...new Set(friendsData.map(friend => friend.gender))].sort();
    setAvailableOptions(prev => ({
      ...prev,
      genders: uniqueGenders
    }));
  }, []);

  const stateHasValidUsers = (state: string, selectedGenders: string[]) => {
    if (selectedGenders.length === 0) return true;
    return friendsData.some(friend => 
      friend.state === state && selectedGenders.includes(friend.gender)
    );
  };

  // Function to check if a city has users matching selected genders and states
  const cityHasValidUsers = (city: string, selectedGenders: string[], selectedStates: string[]) => {
    if (selectedGenders.length === 0 && selectedStates.length === 0) return true;
    return friendsData.some(friend => 
      friend.city === city && 
      (selectedGenders.length === 0 || selectedGenders.includes(friend.gender)) &&
      (selectedStates.length === 0 || selectedStates.includes(friend.state))
    );
  };

  // Function to get valid states based on selected genders
  const getValidStates = (selectedGenders: string[]) => {
    const validStates = [...new Set(friendsData
      .filter(friend => selectedGenders.length === 0 || selectedGenders.includes(friend.gender))
      .map(friend => friend.state)
    )].sort();
    return validStates;
  };

  // Get valid cities based on selected genders and states
  const getValidCities = (selectedGenders: string[], selectedStates: string[]) => {
    const validCities = [...new Set(friendsData
      .filter(friend => {
        const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(friend.gender);
        const stateMatch = selectedStates.length === 0 || selectedStates.includes(friend.state);
        return genderMatch && stateMatch;
      })
      .map(friend => friend.city)
    )].sort();
    return validCities;
  };

  // Update available and selected options when gender selection changes
  useEffect(() => {
    // Get valid states based on selected genders
    const validStates = getValidStates(selectedFilters.genders);
    
    // Clean up selected states
    const cleanedStates = selectedFilters.states.filter(state => 
      stateHasValidUsers(state, selectedFilters.genders)
    );

    // Get valid cities based on new states
    const validCities = getValidCities(selectedFilters.genders, cleanedStates);
    
    // Clean up selected cities
    const cleanedCities = selectedFilters.cities.filter(city => 
      cityHasValidUsers(city, selectedFilters.genders, cleanedStates)
    );

    // Update available options
    setAvailableOptions(prev => ({
      ...prev,
      states: validStates,
      cities: validCities
    }));

    // Update selected filters if anything was cleaned
    if (cleanedStates.length !== selectedFilters.states.length || 
        cleanedCities.length !== selectedFilters.cities.length) {
      setSelectedFilters(prev => ({
        ...prev,
        states: cleanedStates,
        cities: cleanedCities
      }));
    }
  }, [selectedFilters.genders]);

  // Update available cities when states change
  useEffect(() => {
    // Get valid cities based on current filters
    const validCities = getValidCities(selectedFilters.genders, selectedFilters.states);
    
    // Clean up selected cities
    const cleanedCities = selectedFilters.cities.filter(city => 
      cityHasValidUsers(city, selectedFilters.genders, selectedFilters.states)
    );

    // Update available options
    setAvailableOptions(prev => ({
      ...prev,
      cities: validCities
    }));

    // Update selected filters if cities were cleaned
    if (cleanedCities.length !== selectedFilters.cities.length) {
      setSelectedFilters(prev => ({
        ...prev,
        cities: cleanedCities
      }));
    }
  }, [selectedFilters.states]);

  const handleGendersChange = (genders: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      genders
    }));
    setNoMatchesError(null);
  };

  const handleStatesChange = (states: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      states
    }));
    setNoMatchesError(null);
  };

  const handleCitiesChange = (cities: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      cities
    }));
    setNoMatchesError(null);
  };  

  const handlePress = () => {
    console.log('Find New Friends pressed');
  };

  const filterFriends = (filters: typeof selectedFilters) => {
    let filteredFriends = [...friendsData];

    if (filters.genders.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.genders.includes(friend.gender)
      );
    }
    if (filters.states.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.states.includes(friend.state)
      );
    }
    if (filters.cities.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.cities.includes(friend.city)
      );
    }

    return filteredFriends;
  };

  const handleFindFriends = () => {
    const matchingFriends = filterFriends(selectedFilters);

    if (matchingFriends.length === 0) {
      setNoMatchesError("We're sorry, but there are currently no friends matching your criteria. Try broadening your search!");
    } else {
      setNoMatchesError(null);
      router.push({
        pathname: '/FindingFriends',
        params: {
          filters: JSON.stringify(selectedFilters)
        }
      });
    }
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
          <GenderDropdownFindFriends 
            onGendersChange={handleGendersChange}
            availableGenders={availableOptions.genders}
          />
          <StateDropdownFindFriends 
            onStatesChange={handleStatesChange}
            availableStates={availableOptions.states}
          />
          <CityDropdownFindFriends 
            onCitiesChange={handleCitiesChange}
            availableCities={availableOptions.cities}
          />
          {noMatchesError && (
            <Text style={styles.errorText}>{noMatchesError}</Text>
          )}
          <FindFriendsButton onPress={handleFindFriends} />
          <View style={styles.introContainer}>
            <Text style={styles.Announcement}>As a FREE user, you cannot find new friends; you can only receive random matches. Upgrade to find up to four new friends per day on your terms!</Text>
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
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FindNewFriends;
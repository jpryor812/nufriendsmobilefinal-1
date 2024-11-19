import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { collection, query, where, getDocs, Query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import StateDropdownFindFriends from '../components/StateDropdownFindFriends';
import GenderDropdownFindFriends from '../components/GenderDropdownFindFriends';
import CityDropdownFindFriends from '@/components/CityDropdownFindFriends';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import SafeLayout from '@/components/SafeLayout';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

// Helper function for Firebase queries
const createOrQuery = (field: string, values: string[]) => {
  if (values.length === 0) return null;
  return where(field, 'in', values);
};

const FindNewFriends = () => {
  const router = useRouter();
  
  const [selectedFilters, setSelectedFilters] = useState({
    cities: [] as string[],
    states: [] as string[],
    genders: [] as string[],
  });

  const [availableOptions, setAvailableOptions] = useState({
    genders: [] as string[],
    states: [] as string[],
    cities: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [noMatchesError, setNoMatchesError] = useState<string | null>(null);

  const filterFriends = async (filters: typeof selectedFilters) => {
    try {
      let baseQuery = query(collection(db, 'users'));
      const conditions = [];

      // Add conditions for each filter with values
      if (filters.genders.length > 0) {
        conditions.push(where('demographics.gender', 'in', filters.genders));
      }
      if (filters.states.length > 0) {
        conditions.push(where('demographics.state', 'in', filters.states));
      }
      if (filters.cities.length > 0) {
        conditions.push(where('demographics.city', 'in', filters.cities));
      }

      // Apply all conditions to query
      if (conditions.length > 0) {
        baseQuery = query(collection(db, 'users'), ...conditions);
      }

      const querySnapshot = await getDocs(baseQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  };

  // Function to get unique values for dropdowns from Firestore
  const getUniqueFieldValues = async (fieldPath: string) => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const values = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        // Handle nested fields (e.g., 'demographics.gender')
        const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
        if (value) values.add(value);
      });

      return Array.from(values).sort();
    } catch (error) {
      console.error(`Error getting ${fieldPath} values:`, error);
      return [];
    }
  };


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsInitialLoading(true);
        const [genders, states, cities] = await Promise.all([
          getUniqueFieldValues('demographics.gender'),
          getUniqueFieldValues('demographics.state'),
          getUniqueFieldValues('demographics.city')
        ]);

        setAvailableOptions({
          genders,
          states,
          cities
        });
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle filter changes
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

  const handleFindFriends = async () => {
    setIsLoading(true);
    setNoMatchesError(null);
    
    try {
      const matchingFriends = await filterFriends(selectedFilters);

      if (matchingFriends.length === 0) {
        setNoMatchesError(
          "We're sorry, but there are currently no friends matching your criteria. Try broadening your search!"
        );
      } else {
        router.push({
          pathname: '/FindingFriends',
          params: {
            filters: JSON.stringify(selectedFilters),
            matchedUsers: JSON.stringify(matchingFriends)
          }
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setNoMatchesError(
        "An error occurred while searching. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return(
  <SafeLayout style={styles.container}>
  <Link href="/HomePage" style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color={Colors.primary} />
  </Link>
  
  {isInitialLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading available friends...</Text>
    </View>
  ) : (
    <ScrollView style={styles.scrollContainer}>
      <Image 
        source={require('@/assets/images/Yu_excited_no_speech.png')} 
        style={styles.yuImage} 
      />
      <Text style={styles.PageTitle}>Find Your New Friend!!</Text>
      <Text style={styles.PageSubTitle}>
        Feel free to use multiple filters! For example, select both "Male" and "Female"
        to find friends of any gender in your selected locations!
      </Text>
      
      <View style={styles.dropdownsContainer}>
        <GenderDropdownFindFriends 
          onGendersChange={handleGendersChange}
          availableGenders={availableOptions.genders}
          selectedGenders={selectedFilters.genders}
        />
        <StateDropdownFindFriends 
          onStatesChange={handleStatesChange}
          availableStates={availableOptions.states}
          selectedStates={selectedFilters.states}
        />
        <CityDropdownFindFriends 
          onCitiesChange={handleCitiesChange}
          availableCities={availableOptions.cities}
          selectedCities={selectedFilters.cities}
        />
        
        {noMatchesError && (
          <Text style={styles.errorText}>{noMatchesError}</Text>
        )}
        
        <FindFriendsButton 
          onPress={handleFindFriends}
          isLoading={isLoading}
          disabled={isLoading}
        />

        <View style={styles.introContainer}>
          <Text style={styles.Announcement}>
            As a FREE user, you cannot find new friends; you can only receive 
            random matches. Upgrade to find up to four new friends per day on your terms!
          </Text>
          <FindMoreFriendsButton onPress={() => router.push('/UpgradeToPremium')} />
        </View>
      </View>
    </ScrollView>
  )}
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
    marginTop: 10,
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
    marginTop: 2,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#9d9d9d',
    marginHorizontal: 24,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 2,
    marginBottom: -4,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  yuImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
});

export default FindNewFriends;
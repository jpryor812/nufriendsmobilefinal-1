import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
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
      const currentUser = auth.currentUser; // Add this
      const currentUserDoc = await getDoc(doc(db, 'users', currentUser?.uid || '')); // Add this
      const currentUserAge = currentUserDoc.data()?.demographics?.age || 0; // Add this
  
      // Filter results based on age logic
      const filteredResults = querySnapshot.docs.filter(doc => {
        const userData = doc.data();
        const userAge = userData.demographics?.age || 0;
  
        // Skip the current user
        if (doc.id === currentUser?.uid) {
          return false;
        }
  
        // Age filtering logic
        if (currentUserAge < 13 || userAge < 13) {
          return false; // No matches for users under 13
        }
  
        // 13-17 age group
        if (currentUserAge >= 13 && currentUserAge <= 17) {
          return userAge >= 13 && userAge <= 17;
        }
  
        // 18-20 age group
        if (currentUserAge >= 18 && currentUserAge <= 20) {
          return userAge >= 18 && userAge <= 24;
        }
  
        // 21+ age group
        const minAge = Math.max(18, currentUserAge - 4);
        const maxAge = currentUserAge + 4;
        return userAge >= minAge && userAge <= maxAge;
      });
  
      return filteredResults.map(doc => ({
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
        const nestedValue: any = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
        if (nestedValue && typeof nestedValue === 'string' && nestedValue.trim() !== '') {
          values.add(nestedValue);
        }
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
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadAvailableStates = async () => {
      try {
        let q = query(collection(db, 'users'));
        if (selectedFilters.genders.length > 0) {
          q = query(q, where('demographics.gender', 'in', selectedFilters.genders));
        }
        const snapshot = await getDocs(q);
        const states = new Set<string>();
        
        snapshot.docs.forEach(doc => {
          const state = doc.data().demographics?.state;
          if (state && typeof state === 'string' && state.trim() !== '') {
            states.add(state);
          }
        });
    
        setAvailableOptions(prev => ({
          ...prev,
          states: Array.from(states).sort()
        }));
      } catch (error) {
        console.error('Error loading states:', error);
      }
    };
  
    loadAvailableStates();
  }, [selectedFilters.genders]);

  useEffect(() => {
    const loadAvailableCities = async () => {
      try {
        let q = query(collection(db, 'users'));
   
        if (selectedFilters.genders.length > 0) {
          q = query(q, where('demographics.gender', 'in', selectedFilters.genders));
        }
   
        const snapshot = await getDocs(q);
        const cities = new Set<string>();
        
        snapshot.docs.forEach(doc => {
          const city = doc.data().demographics?.city;
          if (city && typeof city === 'string' && city.trim() !== '') {
            cities.add(city);
          }
        });
   
        setAvailableOptions(prev => ({
          ...prev,
          cities: Array.from(cities).sort()
        }));
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
   
    loadAvailableCities();
   }, [selectedFilters.genders]);

   useEffect(() => {
    const loadAvailableGenders = async () => {
      try {
        let q = query(collection(db, 'users'));
   
        if (selectedFilters.states.length > 0) {
          q = query(q, where('demographics.state', 'in', selectedFilters.states));
        }
        if (selectedFilters.cities.length > 0) {
          q = query(q, where('demographics.city', 'in', selectedFilters.cities));
        }
   
        const snapshot = await getDocs(q);
        const genders = new Set<string>();
        
        snapshot.docs.forEach(doc => {
          const gender = doc.data().demographics?.gender;
          if (gender && typeof gender === 'string' && gender.trim() !== '') {
            genders.add(gender);
          }
        });
   
        setAvailableOptions(prev => ({
          ...prev,
          genders: Array.from(genders).sort()
        }));
      } catch (error) {
        console.error('Error loading genders:', error);
      }
    };
   
    loadAvailableGenders();
   }, [selectedFilters.states, selectedFilters.cities]); 

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
    }
  };

  return(
  <SafeLayout style={styles.container}>
  <Link href="/HomePage" style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color={Colors.primary} />
  </Link>
    <ScrollView style={styles.scrollContainer}>
      <Image 
        source={require('@/assets/images/Yu_excited_no_speech.png')} 
        style={styles.yuImage} 
      />
      <Text style={styles.PageTitle}>Find Your New Friend!!</Text>
      <Text style={styles.PageSubTitle}>
      Use the filters to find your new friend, or leave them blank and search for anyone, anywhere!
      </Text>
      <Text style={styles.PageSubSubTitle}>
      Note: If you're unable to do certain searches, it's because we don't have any users who meet those criteria, but I'm sure we will soon!  
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
          selectedStates={selectedFilters.states}  // Add this
        />
        
        {noMatchesError && (
          <Text style={styles.errorText}>{noMatchesError}</Text>
        )}
        
        <FindFriendsButton 
          onPress={handleFindFriends}
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
    marginTop: 6,
    textAlign: 'center',
  },
  PageSubTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
    marginHorizontal: 24,
  },
  PageSubSubTitle: {
    fontSize: 10,
    marginTop: 4,
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
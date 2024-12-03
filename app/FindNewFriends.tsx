import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import StateDropdownFindFriends from '../components/StateDropdownFindFriends';
import GenderDropdownFindFriends from '../components/GenderDropdownFindFriends';
import CityDropdownFindFriends from '@/components/CityDropdownFindFriends';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import SafeLayout from '@/components/SafeLayout';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import { supabase } from '@/config/supabase';

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
      let query = supabase
        .from('demographics')
        .select(`
          user_id,
          age,
          gender,
          state,
          city,
          profiles!inner(username)
        `);

      // Add filters
      if (filters.genders.length > 0) {
        query = query.in('gender', filters.genders);
      }
      if (filters.states.length > 0) {
        query = query.in('state', filters.states);
      }
      if (filters.cities.length > 0) {
        query = query.in('city', filters.cities);
      }

      const { data: users, error } = await query;

      if (error) throw error;

      // Get current user's age
      const { data: currentUserData } = await supabase
        .from('demographics')
        .select('age')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const currentUserAge = currentUserData?.age || 0;

      // Filter results based on age logic
      const filteredResults = users?.filter(user => {
        const userAge = user.age || 0;

        // Skip the current user
        if (user.user_id === (supabase.auth.getUser()).data.user?.id) {
          return false;
        }

        if (currentUserAge < 13 || userAge < 13) {
          return false;
        }

        if (currentUserAge >= 13 && currentUserAge <= 17) {
          return userAge >= 13 && userAge <= 17;
        }

        if (currentUserAge >= 18 && currentUserAge <= 20) {
          return userAge >= 18 && userAge <= 24;
        }

        const minAge = Math.max(18, currentUserAge - 4);
        const maxAge = currentUserAge + 4;
        return userAge >= minAge && userAge <= maxAge;
      });

      return filteredResults || [];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  };

  const getUniqueFieldValues = async (fieldName: string) => {
    try {
      const { data, error } = await supabase
        .from('demographics')
        .select(fieldName)
        .not(fieldName, 'is', null);

      if (error) throw error;

      const values = new Set<string>();
      data?.forEach(item => {
        const value = item[fieldName as keyof typeof item];
        if (value && typeof value === 'string' && value.trim() !== '') {
          values.add(value);
        }
      });

      return Array.from(values).sort();
    } catch (error) {
      console.error(`Error getting ${fieldName} values:`, error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [genders, states, cities] = await Promise.all([
          getUniqueFieldValues('gender'),
          getUniqueFieldValues('state'),
          getUniqueFieldValues('city')
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
            selectedStates={selectedFilters.states}
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
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  yuImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 40,
  },
  PageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: Colors.primary,
  },
  PageSubTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  PageSubSubTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  dropdownsContainer: {
    gap: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  introContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  Announcement: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
});

export default FindNewFriends;
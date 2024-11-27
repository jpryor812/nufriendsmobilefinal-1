import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { topUsCitiesByState, StateName, CityName } from '@/constants/topUsCities';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import GenderDropdown from '../components/GenderDropdown';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import ProgressBar from '@/components/ProgressBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeLayout from '@/components/SafeLayout';
import UsernameInput from '@/components/UsernameInput';
import AgePicker from '@/components/BirthdayDropdown';
import { httpsCallable } from 'firebase/functions';
import { auth, functions as baseFunctions } from '@/config/firebase';

interface AgeData {
  age: number;
  birthDate: number;
  isEligible: boolean;
}

interface Filters {
  cities: CityName[];
  states: StateName[];
  genders: string[];
}

const OnboardingBasicQuestions = () => {
  const router = useRouter();
  const { updateDemographics } = useAuth();
  const [username, setUsername] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    cities: [],
    states: [],
    genders: [],
  });
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState<StateName | ''>('');
  const [ageData, setAgeData] = useState<AgeData | null>(null);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const genderOptions = ['Male', 'Female', 'Non-binary'];

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  const handleStateChange = (state: StateName) => {
    setSelectedState(state);
    setSelectedFilters(prev => ({
      ...prev,
      states: state ? [state] : [],
      cities: [] // Reset cities when state changes
    }));
  };

  function handleCityChange(city: CityName) {
    setSelectedFilters(prev => ({
      ...prev,
      cities: city ? [city] : []
    }));
  }

  const handleGendersChange = (gender: string) => {
    setSelectedGenders(gender ? [gender] : []); // Wrap single gender in array
    setSelectedFilters(prev => ({
      ...prev,
      genders: gender ? [gender] : []
    }));
  };

  const handleAgeChange = (data: AgeData) => {
    setAgeData(data);
  };

  const handleContinue = async () => {
    try {
      // Validate username
      if (!username) {
        setError('Please enter your username');
        return;
      }

      // Validate age
      if (!ageData || !ageData.isEligible) {
        setError('You must be at least 13 years old to use this app');
        return;
      }
      
      // Validate other fields
      if (!selectedFilters.genders[0] || !selectedFilters.states[0] || !selectedFilters.cities[0]) {
        setError('Please fill in all fields');
        return;
      }

      // Save demographics to Firebase
      await updateDemographics(
        ageData.age,
        selectedFilters.genders[0],
        selectedFilters.states[0],
        selectedFilters.cities[0],
        ageData.birthDate
      );

      // Continue to next screen
      router.push('/OnboardingQuestion1');
    } catch (err) {
      setError('Failed to save information. Please try again.');
      console.error('Error saving demographics:', err);
    }
  };

  return (
    <SafeLayout style={styles.container}>
      <ProgressBar progress={30} />
      <View style={styles.contentContainer}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
        >
          <SmallYuOnboarding text={'Before we jump in, please fill out the following information!'} />
          <View style={styles.dropdownsContainer}>
            <GenderDropdown
              onGendersChange={handleGendersChange}
              availableGenders={genderOptions}
              selectedGenders={selectedGenders}
            />
            <StateDropdown 
              onStatesChange={handleStateChange}
              selectedState={selectedState}
            />
            <CityDropdown 
              onCitiesChange={handleCityChange}
              availableCities={selectedState ? topUsCitiesByState[selectedState] : []}
              selectedCities={selectedFilters.cities}
            />
            <AgePicker onAgeChange={handleAgeChange} />
          </View>
          <UsernameInput 
            onUsernameChange={handleUsernameChange}
          />
          <Text style={styles.usernameNote}>
            Note: You must wait six months to change your username again
          </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </KeyboardAwareScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#F0FCFE',
  },
  contentContainer: {
    flex: 1, // This ensures the content takes up all available space
    width: '100%',
  },
    scrollContainer: {
        width: '100%',
        flex: 1,
    },
  dropdownsContainer: {
    padding: 12,
    gap: 8,
    marginTop: -10,
  },
  introContainer: {
    borderRadius: 30,
    padding: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#F0FCFE',
    // Add shadow if needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    backgroundColor: '#57C7FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  usernameNote: {
    color: '#a9a9a9',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: -8,
  },
  inputContainer: {
    padding: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default OnboardingBasicQuestions;
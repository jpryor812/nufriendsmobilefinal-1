import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import GenderDropdown from '../components/GenderDropdown';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import ProgressBar from '@/components/ProgressBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeLayout from '@/components/SafeLayout';
import UsernameInput from '@/components/UsernameInput';

const OnboardingBasicQuestions = () => {
    const router = useRouter();
    const { updateDemographics } = useAuth();
    const [selectedFilters, setSelectedFilters] = useState({
      cities: [] as string[],
      states: [] as string[],
      genders: [] as string[],
    });
    const [error, setError] = useState('');
    const [selectedState, setSelectedState] = useState('');
  
    const handleStateChange = (state: string) => {
      setSelectedState(state);
      setSelectedFilters(prev => ({
        ...prev,
        states: state ? [state] : []
      }));
    };
  
    const handleCityChange = (city: string) => {
      setSelectedFilters(prev => ({ 
        ...prev, 
        cities: city ? [city] : [] 
      }));
    };
  
    const handleGendersChange = (gender: string) => {
      setSelectedFilters(prev => ({ 
        ...prev, 
        genders: gender ? [gender] : [] 
      }));
    };

    const handleContinue = async () => {
      try {
        // Validate that all fields are filled
        if (!selectedFilters.genders[0] || !selectedFilters.states[0] || !selectedFilters.cities[0]) {
          setError('Please fill in all fields');
          return;
        }

        // Save demographics to Firebase
        await updateDemographics(
          selectedFilters.genders[0],
          selectedFilters.states[0],
          selectedFilters.cities[0]
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
              <GenderDropdown onGendersChange={handleGendersChange} />
              <StateDropdown onStatesChange={handleStateChange} />
              <CityDropdown 
                onCitiesChange={handleCityChange}
                selectedState={selectedState}
              />
            </View>
            <UsernameInput />
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
});

export default OnboardingBasicQuestions;
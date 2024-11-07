import React, {useState} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import CountryDropdown from '../components/CountryDropdown';
import GenderDropdown from '../components/GenderDropdown';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import FooterNavigation from '@/components/FooterNavigation';
import EmailInput from '@/components/EmailInput';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import ProgressBar from '@/components/ProgressBar';

const OnboardingBasicQuestions = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = useState({
      cities: [] as string[],
      states: [] as string[],
      countries: [] as string[],
      genders: [] as string[],
    });
  
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [selectedState, setSelectedState] = useState('');
  
    const handleCountriesChange = (country: string) => {
        const showStates = country === 'United States of America';
        setShowStateDropdown(showStates);
      // Reset state and city if country changes
      if (!showStates) {
        setSelectedState('');
        setShowCityDropdown(false);
      }
    };
  
    const handleStateChange = (state: string) => {
      setSelectedState(state);
      // Show city dropdown when a state is selected
      setShowCityDropdown(!!state);
    };
  
    const handleCityChange = (city: string) => {
      console.log('Selected city:', city);
      setSelectedFilters(prev => ({ 
        ...prev, 
        cities: city ? [city] : [] 
      }));
    };
  
    const handleGendersChange = (genders: string[]) => {
      setSelectedFilters(prev => ({ ...prev, genders }));
    };

    const handleEmailSubmit = (email: string) => {
        console.log('Email submitted:', email);
        // You can add any additional validation or data handling here
        router.push('/OnboardingQuestion1'); // Replace with your actual next page route
      };
  
    return (
      <SafeAreaView style={styles.container}>
      <ProgressBar progress={30} />
        <ScrollView style={styles.scrollContainer}>
            <SmallYuOnboarding text={'Before we jump in, please fill out the following information!'} />
            <EmailInput />
          <View style={styles.dropdownsContainer}>
            <GenderDropdown onGendersChange={handleGendersChange} />
            <CountryDropdown onCountriesChange={handleCountriesChange} />
            
            {showStateDropdown && (
              <StateDropdown onStatesChange={handleStateChange} />
            )}
            
            {showCityDropdown && (
              <CityDropdown 
                onCitiesChange={handleCityChange}
                selectedState={selectedState}  // Changed from selectedFilters.states[0]
              />
            )}


          </View>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/OnboardingQuestion1')}>
            <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
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
    scrollContainer: {
        width: '100%',
        padding: 10,
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
  Announcement: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    marginHorizontal: 10,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#42ade2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OnboardingBasicQuestions;
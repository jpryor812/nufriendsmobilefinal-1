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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  
    const handleGendersChange = (gender: string) => {  // Changed from (genders: string[])
        setSelectedFilters(prev => ({ 
          ...prev, 
          genders: gender ? [gender] : [] 
        }));
      };

    const handleEmailSubmit = (email: string) => {
        console.log('Email submitted:', email);
        // You can add any additional validation or data handling here
        router.push('/OnboardingQuestion1'); // Replace with your actual next page route
      };
  
    return (
        <SafeAreaView style={styles.container}>
        <ProgressBar progress={30} />
        <View style={styles.contentContainer}>  {/* Add this wrapper */}
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
        >
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
            </KeyboardAwareScrollView>
        </View>
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
});

export default OnboardingBasicQuestions;
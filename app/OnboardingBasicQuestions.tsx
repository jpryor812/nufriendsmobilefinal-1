import React, {useState} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import GenderDropdown from '../components/GenderDropdown';
import FindMoreFriendsButton from '@/components/FindMoreFriendsButton';
import FindFriendsButton from '@/components/FindMyFriendsButton';
import FooterNavigation from '@/components/FooterNavigationIOS';
import EmailInput from '@/components/EmailInput';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import ProgressBar from '@/components/ProgressBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeLayout from '@/components/SafeLayout';
import UsernameInput from '@/components/UsernameInput';

const OnboardingBasicQuestions = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = useState({
      cities: [] as string[],
      states: [] as string[],
      genders: [] as string[],
    });
  
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

    const handleEmailSubmit = (email: string) => {
      console.log('Email submitted:', email);
      router.push('/OnboardingQuestion1');
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
            <EmailInput />
            <View style={styles.dropdownsContainer}>
              <GenderDropdown onGendersChange={handleGendersChange} />
              <StateDropdown onStatesChange={handleStateChange} />
              <CityDropdown 
                onCitiesChange={handleCityChange}
                selectedState={selectedState}
              />
            </View>
            <UsernameInput />
          </KeyboardAwareScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/OnboardingQuestion1')}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeLayout>
    );
}

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
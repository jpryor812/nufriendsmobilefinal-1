import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CityDropdown from '../components/CityDropdown';
import StateDropdown from '../components/StateDropdown';
import CountryDropdown from '../components/CountryDropdown';
import GenderDropdown from '../components/GenderDropdown';

const FindNewFriends = () => {
  const handleCitiesChange = (cities: string[]) => {
    console.log('Selected cities:', cities);
  };

  const handleStatesChange = (states: string[]) => {
    console.log('Selected states:', states);
  };

  const handleCountriesChange = (countries: string[]) => {
    console.log('Selected countries:', countries);
  };

  const handleGendersChange = (genders: string[]) => {
    console.log('Selected genders:', genders);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dropdownsContainer}>
        <CityDropdown onCitiesChange={handleCitiesChange} />
        <StateDropdown onStatesChange={handleStatesChange} />
        <CountryDropdown onCountriesChange={handleCountriesChange} />
        <GenderDropdown onGendersChange={handleGendersChange} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  dropdownsContainer: {
    padding: 20,
    gap: 20,
  },
});

export default FindNewFriends;
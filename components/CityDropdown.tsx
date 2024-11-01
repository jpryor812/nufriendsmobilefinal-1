//When we launch, only show countries/states/cities where we have active users
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface CityDropdownProps {
  onCitiesChange?: (cities: string[]) => void;
}

const CityDropdown = ({ onCitiesChange }: CityDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const buttonRef = useRef<TouchableOpacity>(null);

  const topUsCities = [
    "Albuquerque",
    "Anaheim",
    "Anchorage",
    "Arlington",
    "Atlanta",
    "Aurora",
    "Austin",
    "Bakersfield",
    "Baltimore",
    "Boston",
    "Charlotte",
    "Cincinnati",
    "Cleveland",
    "Colorado Springs",
    "Columbus",
    "Corpus Christi",
    "Dallas",
    "Denver",
    "Detroit",
    "Durham",
    "El Paso",
    "Fort Worth",
    "Fresno",
    "Greensboro",
    "Henderson",
    "Honolulu",
    "Houston",
    "Indianapolis",
    "Irvine",
    "Jacksonville",
    "Jersey City",
    "Kansas City",
    "Las Vegas",
    "Lexington",
    "Lincoln",
    "Long Beach",
    "Los Angeles",
    "Louisville",
    "Memphis",
    "Mesa",
    "Miami",
    "Milwaukee",
    "Minneapolis",
    "Nashville",
    "New Orleans",
    "New York",
    "Newark",
    "North Las Vegas",
    "Oakland",
    "Oklahoma City",
    "Omaha",
    "Orlando",
    "Philadelphia",
    "Phoenix",
    "Pittsburgh",
    "Plano",
    "Portland",
    "Raleigh",
    "Riverside",
    "Sacramento",
    "Saint Paul",
    "San Antonio",
    "San Diego",
    "San Francisco",
    "San Jose",
    "Santa Ana",
    "Seattle",
    "St. Louis",
    "Stockton",
    "Tampa",
    "Tucson",
    "Tulsa",
    "Virginia Beach",
    "Washington",
    "Wichita"
  ] as const;

  const toggleDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownTop(py + height);
        setDropdownLeft(px + width / 3 - (width * 0.65) / 2);
      });
    }
    setVisible(!visible);
  };

  const handleCitySelect = (city: string) => {
    if (!selectedCities.includes(city)) {
      const newSelectedCities = [...selectedCities, city];
      setSelectedCities(newSelectedCities);
      onCitiesChange?.(newSelectedCities);
    }
  };

  const removeCity = (cityToRemove: string) => {
    const newSelectedCities = selectedCities.filter(city => city !== cityToRemove);
    setSelectedCities(newSelectedCities);
    onCitiesChange?.(newSelectedCities);
  };

  const availableCities = topUsCities.filter(city => !selectedCities.includes(city));

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => {
        handleCitySelect(item);
        setVisible(false);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Main dropdown button */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          ref={buttonRef} 
          style={styles.button} 
          onPress={toggleDropdown}
        >
          <Text style={styles.buttonText}>
            {selectedCities.length > 0 
              ? `${selectedCities.length} cities selected`
              : 'Select cities'}
          </Text>
          <Text style={styles.icon}>▼</Text>
        </TouchableOpacity>

        {/* Dropdown modal */}
        <Modal visible={visible} transparent animationType="none">
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={() => setVisible(false)}
          >
            <View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}>
              <FlatList
                data={availableCities}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Selected cities horizontal scroll */}
      {selectedCities.length > 0 && (
        <View style={styles.selectedCitiesContainer}>
          <Text style={styles.selectedCitiesSubTitle}>Side scroll to view all selections</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {selectedCities.map((city) => (
              <View key={city} style={styles.cityChip}>
                <Text style={styles.cityChipText}>{city}</Text>
                <TouchableOpacity
                  onPress={() => removeCity(city)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

container: {
    width: '100%',
  },
  dropdownContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 30,
    width: '54%',
    paddingHorizontal: 10,
    zIndex: 1,
    borderColor: '#aaa',
    borderWidth: 2,
    borderRadius: 20,
  },
  buttonText: {
    flex: 1,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '50%',
    maxHeight: 300,
    shadowColor: '#000000',
    shadowRadius: 12,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    borderRadius: 10,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  list: {
    maxHeight: 300,
  },
  selectedCitiesContainer: {
    width: '100%',
    paddingHorizontal: 4,
  },
  selectedCitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedCitiesSubTitle: {
    fontSize: 10,
    marginBottom: 8,
    marginTop: -4,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollView: {
    maxHeight: 50,
  },
  scrollViewContent: {
    paddingVertical: 5,
    gap: 10,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#42ade2',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  cityChipText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#666',
  },
});

export default CityDropdown;
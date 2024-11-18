//When we launch, only show countries/states/cities where we have active users
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { citiesByState } from './CitiesByState';

interface CityDropdownProps {
  onCitiesChange: (city: string) => void;
  selectedState: string;  // Keep this as it's needed for city filtering
  defaultValue?: string;
}

const CityDropdown: React.FC<CityDropdownProps> = ({ 
  onCitiesChange, 
  selectedState, 
  defaultValue 
}) => {
  const [selectedCity, setSelectedCity] = useState(defaultValue || '');    const [visible, setVisible] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const buttonRef = useRef<TouchableOpacity>(null);

    const getAvailableCities = () => {
        if (!selectedState) return [];
        return citiesByState[selectedState] || [];
    };

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
        setSelectedCity(city);
        onCitiesChange?.(city);
        setVisible(false);
    };

    const removeCity = () => {
        setSelectedCity('');
        onCitiesChange?.('');
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={styles.item} 
            onPress={() => handleCitySelect(item)}
        >
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                    ref={buttonRef} 
                    style={[
                        styles.button,
                        !selectedState && styles.buttonDisabled
                    ]} 
                    onPress={toggleDropdown}
                    disabled={!selectedState}
                >
    <Text style={[
        styles.buttonText,
        !selectedState && styles.buttonTextDisabled
    ]}>
        {!selectedState 
            ? 'Select a state first'
            : 'Select a city'}
    </Text>
    <Text style={styles.icon}>▼</Text>
</TouchableOpacity>

                <Modal visible={visible} transparent animationType="none">
                    <TouchableOpacity 
                        style={styles.overlay} 
                        onPress={() => setVisible(false)}
                    >
                        <View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}>
                            <FlatList
                                data={getAvailableCities()}
                                renderItem={renderItem}
                                keyExtractor={(item) => item}
                                style={styles.list}
                            />
                            
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {selectedState && (
            <Text style={styles.NoCityText}>
               If you don't see your city, please select the closest one to you, or just leave it blank. 
            </Text>
        )}

            {selectedCity !== '' && (
                <View style={styles.selectedCitiesContainer}>
                    <View style={styles.cityChip}>
                        <Text style={styles.cityChipText}>{selectedCity}</Text>
                        <TouchableOpacity
                            onPress={removeCity}
                            style={styles.removeButton}
                        >
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
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
  NoCityText: {
    fontSize: 10,
    marginTop: -8,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 22,
  },
  selectedCitiesContainer: {
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 2,
    alignContent: 'center',
  },
  selectedCitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedCitiesSubTitle: {
    fontSize: 10,
    marginBottom: 6,
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
    // Remove marginRight since we only have one chip
    alignSelf: 'center', // Center the chip within its container
    // Add this to ensure chip only takes up needed space:
    flexShrink: 1,
    maxWidth: '90%', // Optional: prevent chip from getting too wide
  },
  buttonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
},
buttonTextDisabled: {
    color: '#999',
},
  cityChipText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
    fontWeight: 'bold',
    // Add these to handle long text properly:
    flexShrink: 1,
    flexWrap: 'wrap',
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
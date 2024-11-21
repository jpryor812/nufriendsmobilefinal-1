import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CityName } from '@/constants/topUsCities'

interface CityDropdownProps {
<<<<<<< HEAD
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
=======
  onCitiesChange: (city: CityName) => void;  // Changed to single city
  availableCities: CityName[];
  selectedCities: CityName[];  // Keep as array for state management compatibility
}

const CityDropdownFindFriends = ({ 
  onCitiesChange, 
  availableCities,
  selectedCities: externalSelectedCities
}: CityDropdownProps) => {
    const [visible, setVisible] = useState(false);
>>>>>>> restore-point2
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const buttonRef = useRef<TouchableOpacity>(null);

    const toggleDropdown = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setDropdownTop(py + height);
                setDropdownLeft(px + width / 3 - (width * 0.65) / 2);
            });
        }
        setVisible(!visible);
    };

    const handleCitySelect = (city: CityName) => {
        onCitiesChange(city);  // Just pass the single city
        setVisible(false);
    };

    const renderItem = ({ item }: { item: CityName }) => (
        <TouchableOpacity 
            style={styles.item} 
            onPress={() => handleCitySelect(item)}
        >
            <View style={styles.itemContainer}>
                <View style={styles.cityInfoContainer}>
                    <Text style={styles.itemText}>{item}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                    ref={buttonRef} 
                    style={[styles.button, externalSelectedCities.length > 0 && styles.buttonActive]}
                    onPress={toggleDropdown}
                >
                    <Text style={styles.buttonText}>
                        {externalSelectedCities.length > 0 
                            ? externalSelectedCities[0]  // Show the single selected city
                            : 'Select city'}  
                    </Text>
                    <Text style={styles.icon}>▼</Text>
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="none">
                    <TouchableOpacity 
                        style={styles.overlay} 
                        onPress={() => setVisible(false)}
                    >
                        <View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}>
                            {availableCities.length > 0 ? (
                                <FlatList
                                    data={availableCities}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item}
                                    style={styles.list}
                                />
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>No cities available with current filters</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {externalSelectedCities.length > 0 && (
                <View style={styles.selectedCitiesContainer}>
                    <View style={styles.cityChip}>
                        <Text style={styles.cityChipText}>{externalSelectedCities[0]}</Text>
                        <TouchableOpacity
                            onPress={() => onCitiesChange('' as CityName)}  // Clear selection
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
  selectedCitiesContainer: {
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 16,
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
    alignSelf: 'center',
    flexShrink: 1,
    maxWidth: '90%',
  },
  cityChipText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
    fontWeight: 'bold',
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

export default CityDropdownFindFriends;
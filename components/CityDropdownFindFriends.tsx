import React, { useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';


interface CityDropdownProps {
    onCitiesChange: (cities: string[]) => void;
    availableCities: string[];
    selectedCities: string[];  // Fix syntax error
    selectedStates: string[];
}  // Add this prop


const CityDropdownFindFriends = ({ 
    onCitiesChange, 
    availableCities,
    selectedCities: externalSelectedCities,
    selectedStates  // Add this
}: CityDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const buttonRef = useRef<TouchableOpacity>(null);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);

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
        if (!externalSelectedCities.includes(city)) {
            const newSelectedCities = [...externalSelectedCities, city];
            onCitiesChange(newSelectedCities);
        }
        setVisible(false);
    };

    const removeCity = (cityToRemove: string) => {
        const newSelectedCities = externalSelectedCities.filter(
            city => city !== cityToRemove
        );
        onCitiesChange(newSelectedCities);
    };

    useEffect(() => {
        const filterCities = async () => {
            if (selectedStates.length === 0) {
                setFilteredCities(availableCities);
                return;
            }
    
            const filtered = await Promise.all(availableCities.map(async (city) => {
                const cityData = await getDocs(
                    query(
                        collection(db, 'users'),
                        where('demographics.city', '==', city),
                        where('demographics.state', 'in', selectedStates)
                    )
                );
                return !cityData.empty ? city : null;
            }));
            
            setFilteredCities(filtered.filter((city): city is string => city !== null));
        };
    
        filterCities();
    }, [selectedStates, availableCities]);

    // Update getStateForCity to use Firestore data

    const renderItem = ({ item }: { item: string }) => (
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
                            ? `${externalSelectedCities.length} cities selected`
                            : 'Select cities'}
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
                                data={filteredCities}
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
                    <Text style={styles.selectedCitiesSubTitle}>Side scroll to view all selections</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.scrollViewContent}
                        style={styles.scrollView}
                    >
                        {externalSelectedCities.map((city) => (
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cityInfoContainer: {
        flex: 1,
    },
    itemText: {
        fontSize: 14,
        fontWeight: '500',
    },
    stateText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    buttonActive: {
        borderColor: '#42ade2',
        borderWidth: 2,
    },
    noDataContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noDataText: {
        color: '#666',
        fontSize: 14,
    },
});

export default CityDropdownFindFriends;
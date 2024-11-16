import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { friendsData } from '../constants/FriendsData';

interface StateDropdownProps {
    onStatesChange?: (states: string[]) => void;
    availableStates?: string[];
}

const StateDropdown = ({ onStatesChange, availableStates }: StateDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [dropdownTop, setDropdownTop] = useState(0);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const buttonRef = useRef<TouchableOpacity>(null);

    // Get unique states from friendsData if availableStates prop is not provided
    const states = availableStates || [...new Set(friendsData.map(friend => friend.state))].sort();

    const toggleDropdown = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setDropdownTop(py + height);
                setDropdownLeft(px + width / 3 - (width * 0.65) / 2);
            });
        }
        setVisible(!visible);
    };

    const handleStateSelect = (state: string) => {
        if (!selectedStates.includes(state)) {
            const newSelectedStates = [...selectedStates, state];
            setSelectedStates(newSelectedStates);
            onStatesChange?.(newSelectedStates);
        }
        setVisible(false);
    };

    const removeState = (stateToRemove: string) => {
        const newSelectedStates = selectedStates.filter(state => state !== stateToRemove);
        setSelectedStates(newSelectedStates);
        onStatesChange?.(newSelectedStates);
    };

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={styles.item} 
            onPress={() => handleStateSelect(item)}
        >
            <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        // Update selected states based on available states
        setSelectedStates(prev => prev.filter(state => availableStates?.includes(state) ?? true));
      }, [availableStates]);

    return (
        <View style={styles.container}>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                    ref={buttonRef} 
                    style={[styles.button, selectedStates.length > 0 && styles.buttonActive]} 
                    onPress={toggleDropdown}
                >
                    <Text style={styles.buttonText}>
                        {selectedStates.length > 0 
                            ? `${selectedStates.length} states selected`
                            : 'Select states'}
                    </Text>
                    <Text style={styles.icon}>▼</Text>
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="none">
                    <TouchableOpacity 
                        style={styles.overlay} 
                        onPress={() => setVisible(false)}
                    >
                        <View style={[styles.dropdown, { top: dropdownTop, left: dropdownLeft }]}>
                            {states.length > 0 ? (
                                <FlatList
                                    data={states}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item}
                                    style={styles.list}
                                />
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>No states available with current filters</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {selectedStates.length > 0 && (
                <View style={styles.selectedStatesContainer}>
                    <Text style={styles.selectedStatesSubTitle}>Side scroll to view all selections</Text>
                    <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.scrollViewContent}
                        style={styles.scrollView}
                    >
                        {selectedStates.map((state) => (
                            <View key={state} style={styles.stateChip}>
                                <Text style={styles.stateChipText}>{state}</Text>
                                <TouchableOpacity
                                    onPress={() => removeState(state)}
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
    itemText: {
        fontSize: 14,
    },
    list: {
        maxHeight: 300,
    },
    selectedStatesContainer: {
        width: '100%',
        paddingHorizontal: 4,
    },
    selectedStatesSubTitle: {
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
    stateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#42ade2',
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    stateChipText: {
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

export default StateDropdown;
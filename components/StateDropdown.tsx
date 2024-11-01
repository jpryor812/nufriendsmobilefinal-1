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

interface StateDropdownProps {
  onStatesChange?: (states: string[]) => void;
}

const StateDropdown = ({ onStatesChange }: StateDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const buttonRef = useRef<TouchableOpacity>(null);

  const usStatesAndTerritories = [
    "Alabama",
    "Alaska",
    "American Samoa",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Guam",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Northern Mariana Islands",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "U.S. Virgin Islands",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
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

  const handleStateSelect = (state: string) => {
    if (!selectedStates.includes(state)) {
      const newSelectedStates = [...selectedStates, state];
      setSelectedStates(newSelectedStates);
      onStatesChange?.(newSelectedStates);
    }
  };

  const removeState = (stateToRemove: string) => {
    const newSelectedStates = selectedStates.filter(state => state !== stateToRemove);
    setSelectedStates(newSelectedStates);
    onStatesChange?.(newSelectedStates);
  };

  const availableStates = usStatesAndTerritories.filter(state => !selectedStates.includes(state));

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => {
        handleStateSelect(item);
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
            {selectedStates.length > 0 
              ? `${selectedStates.length} states selected`
              : 'Select states'}
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
                data={availableStates}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Selected states horizontal scroll */}
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
  list: {
    maxHeight: 300,
  },
  selectedStatesContainer: {
    width: '100%',
    paddingHorizontal: 4,
  },
  selectedStatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
});

export default StateDropdown;
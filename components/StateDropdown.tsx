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
  onStatesChange: (state: string) => void;
  defaultValue?: string;
  selectedState: string;  // Add this prop
}

const StateDropdown: React.FC<StateDropdownProps> = ({ 
  onStatesChange, 
  defaultValue,
  selectedState: externalSelectedState  // Rename to avoid confusion
}) => {
  const [visible, setVisible] = useState(false);
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
    onStatesChange(state);
    setVisible(false);
};

const removeState = () => {
    onStatesChange('');
};

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleStateSelect(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    onStatesChange(state);
  };

  return (
    <View style={styles.container}>
        <View style={styles.dropdownContainer}>
            <TouchableOpacity 
                ref={buttonRef} 
                style={[styles.button, externalSelectedState && styles.buttonActive]}
                onPress={toggleDropdown}
            >
                <Text style={styles.buttonText}>
                    {externalSelectedState 
                        ? externalSelectedState  // Show the selected state
                        : 'Select state'}
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
                            data={usStatesAndTerritories}
                            renderItem={renderItem}
                            keyExtractor={(item) => item}
                            style={styles.list}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>

        {externalSelectedState !== '' && (
            <View style={styles.selectedStatesContainer}>
                <View style={styles.stateChip}>
                    <Text style={styles.stateChipText}>{externalSelectedState}</Text>
                    <TouchableOpacity
                        onPress={removeState}
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
  selectedStatesContainer: {
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 16,
    alignContent: 'center',
  },
  selectedStatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedStatesSubTitle: {
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
  stateChip: {
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
  stateChipText: {
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

export default StateDropdown;
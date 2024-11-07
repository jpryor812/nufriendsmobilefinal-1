import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

interface GenderDropdownProps {
    onGendersChange?: (gender: string) => void;  // Changed from string[] to string
  }  

const GenderDropdown = ({ onGendersChange }: GenderDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('');  // Changed to single string
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const buttonRef = useRef<TouchableOpacity>(null);

  const genders = [
    "Female",
    "Male",
    "Non-binary",
    "Other",
    "Prefer not to say"
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

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    onGendersChange?.(gender);
    setVisible(false);
  };

  const removeGender = () => {
    setSelectedGender('');
    onGendersChange?.('');
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handleGenderSelect(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          ref={buttonRef} 
          style={styles.button} 
          onPress={toggleDropdown}
        >
        <Text style={styles.buttonText}>
        Select a gender  {/* Always show this text */}
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
                data={genders}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {selectedGender !== '' && (
        <View style={styles.selectedGendersContainer}>
          <View style={styles.genderChip}>
            <Text style={styles.genderChipText}>{selectedGender}</Text>
            <TouchableOpacity
              onPress={removeGender}
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
  itemText: {
    fontSize: 14,
  },
  list: {
    maxHeight: 300,
  },
  selectedGendersContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 16,
  },
  selectedGendersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedGendersSubTitle: {
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
  genderChip: {
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
  genderChipText: {
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

export default GenderDropdown;
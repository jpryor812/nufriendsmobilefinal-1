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

interface GenderDropdownProps {
  onGendersChange?: (genders: string[]) => void;
}

const GenderDropdown = ({ onGendersChange }: GenderDropdownProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
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
    if (!selectedGenders.includes(gender)) {
      const newSelectedGenders = [...selectedGenders, gender];
      setSelectedGenders(newSelectedGenders);
      onGendersChange?.(newSelectedGenders);
    }
  };

  const removeGender = (genderToRemove: string) => {
    const newSelectedGenders = selectedGenders.filter(gender => gender !== genderToRemove);
    setSelectedGenders(newSelectedGenders);
    onGendersChange?.(newSelectedGenders);
  };

  const availableGenders = genders.filter(gender => !selectedGenders.includes(gender));

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => {
        handleGenderSelect(item);
        setVisible(false);
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
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
            {selectedGenders.length > 0 
              ? `${selectedGenders.length} genders selected`
              : 'Select genders'}
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
                data={availableGenders}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Selected genders horizontal scroll */}
      {selectedGenders.length > 0 && (
        <View style={styles.selectedGendersContainer}>
          <Text style={styles.selectedGendersTitle}>Selected Genders:</Text>
          <Text style={styles.selectedGendersSubTitle}>Side scroll to view all selections</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
          >
            {selectedGenders.map((gender) => (
              <View key={gender} style={styles.genderChip}>
                <Text style={styles.genderChipText}>{gender}</Text>
                <TouchableOpacity
                  onPress={() => removeGender(gender)}
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
  selectedGendersContainer: {
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  selectedGendersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedGendersSubTitle: {
    fontSize: 8,
    marginBottom: 8,
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
    backgroundColor: '#FFE074',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  genderChipText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
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
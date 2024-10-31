import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const buttonRef = useRef<TouchableOpacity>(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownTop(py + height);
        setDropdownLeft(px + width / 3 - (width * 0.65) / 2); // Center the dropdown
      });
    }
    setVisible(!visible);
  };

  const renderItem = ({ item }: { item: Option }) => (
    <TouchableOpacity style={styles.item} onPress={() => {
      onSelect(item.value);
      setVisible(false);
    }}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity ref={buttonRef} style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>
          {options.find(option => option.value === selectedValue)?.label || 'Select option'}
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
              data={options}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginLeft: 10,
    marginTop: 2,
    alignItems: 'center',
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
});

export default Dropdown;
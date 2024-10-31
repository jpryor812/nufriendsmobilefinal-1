import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const DatingToggle = () => {
  const [isOpenToDating, setIsOpenToDating] = useState(false);

  const toggleDating = () => {
    setIsOpenToDating(!isOpenToDating);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Open to Dating:</Text>
      <TouchableOpacity 
        style={styles.toggleContainer} 
        onPress={toggleDating}
      >
        <Text style={[
          styles.toggleOption, 
          isOpenToDating && styles.selectedOption
        ]}>
          Yes
        </Text>
        <Text style={[
          styles.toggleOption, 
          !isOpenToDating && styles.selectedOption
        ]}>
          No
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  label: {
    fontSize: 14,
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
  },
  toggleOption: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    color: '#fff',
  },
});

export default DatingToggle;
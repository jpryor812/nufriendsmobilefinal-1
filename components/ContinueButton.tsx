import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

interface ContinueProps {
  text: string;
  onContinue: () => void; // Add this prop
}

const Continue: React.FC<ContinueProps> = ({ 
  text, 
  onContinue 
}) => {
  return (

      <TouchableOpacity 
        style={styles.continue_button_container}
        onPress={onContinue}
      >
        <Text style={styles.continue_button_text}>Let's do it!</Text>
      </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  continue_button_container: {
    width: 80,
    height: 20, // Fixed height for the button
    backgroundColor: '#6ECFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  continue_button_text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center', // For Android
  },
});

export default Continue;
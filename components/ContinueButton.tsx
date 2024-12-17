import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ContinueProps {
  onPress: () => void | Promise<void>;
  isLoading?: boolean;
  text?: string;  // Add this prop
}

const Continue: React.FC<ContinueProps> = ({ 
  onPress, 
  isLoading = false, 
  text = "Continue"  // Default text if none provided
}) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Continue;
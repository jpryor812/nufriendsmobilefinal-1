import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FindMoreFriendsButtonProps {
  onPress: () => void;
}

const FindMoreFriendsButton: React.FC<FindMoreFriendsButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
    >
      <Text style={styles.buttonText}>Find More Friends</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '36%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFE074',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#3e3e3e',
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default FindMoreFriendsButton;
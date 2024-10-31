import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  onPressFindFriends: () => void;
  onPressUpgrade: () => void;
}

const HeaderButtons: React.FC<ButtonProps> = ({ onPressFindFriends, onPressUpgrade }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPressFindFriends}>
        <Text style={styles.buttonText}>Find New Friends!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onPressUpgrade}>
        <Text style={styles.buttonText}>Upgrade to Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  button: {
    padding: 10,
    width: '27.5%',
    backgroundColor: '#FFE074',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default HeaderButtons;
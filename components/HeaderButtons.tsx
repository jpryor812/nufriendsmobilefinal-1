import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface ButtonProps {
  onPressUpgrade: () => void;
}

const HeaderButtons: React.FC<ButtonProps> = ({ onPressUpgrade }) => {
  return (
    <View style={styles.buttonContainer}>
      <Link href="/FindNewFriends" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find New Friends!</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={styles.button} 
        onPress={onPressUpgrade}
      >
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
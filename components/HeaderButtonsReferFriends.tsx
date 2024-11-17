import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

interface ButtonProps {
  onPressUpgrade: () => void;
}

const HeaderButtonsRefer: React.FC<ButtonProps> = ({ onPressUpgrade }) => {
  return (
    <View style={styles.buttonContainer}>
      <Link href="/FindNewFriends" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find New Friends!</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/UpgradeToPremium" asChild>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Invite A Friend!</Text>
      </TouchableOpacity>
      </Link>
      
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 6,
    paddingBottom: 10,
    marginRight: 20,
    marginLeft: 20,
  },
  button: {
    padding: 8,
    width: '28%',
    backgroundColor: '#FFE074',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default HeaderButtonsRefer;
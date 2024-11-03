import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const FindingFriends: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finding Friends</Text>
      <Text style={styles.subtitle}>Find new friends to chat with!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Find New Friends!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FCFE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#FFE074',
    borderRadius: 35,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default FindingFriends;
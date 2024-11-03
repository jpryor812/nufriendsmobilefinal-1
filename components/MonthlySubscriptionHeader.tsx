import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../assets/Colors'; // Ensure this path is correct

const MonthlySubscriptionHeader: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <Image 
        source={require('../assets/images/yu_progress_bar.png')} 
        style={styles.yu}
      />
      <Text style={styles.header}>Never Feel Alone Again</Text>
      <Text style={styles.subHeader}>What You Get With Premium:</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes the full height
    backgroundColor: '#F0FCFE',
  },
  backButton: {
    marginLeft: 10,
    padding: 10, // Added padding for better touch target
  },
  yu: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginTop: -16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
    subHeader: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
    },
});

export default MonthlySubscriptionHeader;
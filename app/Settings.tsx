<<<<<<< HEAD
// app/Settings.tsx
=======
>>>>>>> restore-point2
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
<<<<<<< HEAD

const Settings = () => {
  const router = useRouter();

=======
const Settings = () => {
  const router = useRouter();
>>>>>>> restore-point2
  const SettingsItem = ({ 
    icon, 
    title, 
    onPress, 
    showArrow = true 
  }: { 
    icon: string, 
    title: string, 
    onPress: () => void,
    showArrow?: boolean
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon as any} size={24} color={Colors.primary} />
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={24} color="#999" />}
    </TouchableOpacity>
  );
<<<<<<< HEAD

=======
>>>>>>> restore-point2
  return (
    <SafeLayout style={styles.container}>
      <Link href="/ProfilePage" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Link>
      <Text style={styles.title}>Settings</Text>
<<<<<<< HEAD

=======
>>>>>>> restore-point2
      <View style={styles.settingsSection}>
        <SettingsItem
          icon="person-circle-outline"
          title="Account Management"
          onPress={() => router.push('/AccountManagement')}
        />
        
        <SettingsItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => console.log('Notifications')}
        />
<<<<<<< HEAD

=======
>>>>>>> restore-point2
        <SettingsItem
          icon="help-circle-outline"
          title="Contact Us/Help"
          onPress={() => console.log('Help')}
        />
<<<<<<< HEAD

=======
>>>>>>> restore-point2
        <SettingsItem
          icon="document-text-outline"
          title="Terms"
          onPress={() => console.log('Terms')}
        />
<<<<<<< HEAD

=======
>>>>>>> restore-point2
        <SettingsItem
          icon="shield-outline"
          title="Privacy Policy"
          onPress={() => console.log('Privacy')}
        />
<<<<<<< HEAD

=======
>>>>>>> restore-point2
        <SettingsItem
          icon="star-outline"
          title="Leave a Review!"
          onPress={() => console.log('Review')}
        />
      </View>
    </SafeLayout>
  );
};
<<<<<<< HEAD

=======
>>>>>>> restore-point2
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  backButton: {
    top: 10,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    color: '#333',
  },
  settingsSection: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});
<<<<<<< HEAD

=======
>>>>>>> restore-point2
export default Settings;
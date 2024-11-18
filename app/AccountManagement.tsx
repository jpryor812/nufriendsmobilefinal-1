// app/AccountManagement.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import SafeLayout from '@/components/SafeLayout';
import PasswordInput from '@/components/PasswordInput';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

const AccountManagement = () => {
  const router = useRouter();
  const { updateUserPassword, deleteUserAccount } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    try {
      setError('');
      await updateUserPassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserAccount(currentPassword);
              router.push('/OnboardingPage1');
            } catch (err: any) {
              setError(err.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeLayout style={styles.container}>
        
      <View style={styles.content}>
      <Link href="/ProfilePage" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Link>
        <Text style={styles.title}>Account Management</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <PasswordInput
            onPasswordChange={setCurrentPassword}
            placeholder="Current Password"
          />
          <PasswordInput
            onPasswordChange={setNewPassword}
            placeholder="New Password"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delete Account</Text>
          <Text style={styles.warningText}>
            This action cannot be undone. You will lose all your data.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#57C7FF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#FF5757',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    color: '#FF5757',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  backButton: {
    marginLeft: 2,
  },
});

export default AccountManagement;
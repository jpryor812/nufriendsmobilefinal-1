import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { View, StyleSheet, Modal, Text, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
=======
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
>>>>>>> restore-point2
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import SafeLayout from '@/components/SafeLayout';
import PasswordInput from '@/components/PasswordInput';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import UsernameInput from '@/components/UsernameInput';
import StateDropdown from '@/components/StateDropdown';
import CityDropdown from '@/components/CityDropdown';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';

const AccountManagement = () => {
  const router = useRouter();
<<<<<<< HEAD
  const { updateUserPassword, deleteUserAccount, updateProfile, user } = useAuth();
=======
  const { updateUserPassword, updateProfile, user } = useAuth();
>>>>>>> restore-point2
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedState, setSelectedState] = useState(user?.userData?.demographics?.state || '');
  const [selectedCity, setSelectedCity] = useState(user?.userData?.demographics?.city || '');
  const [error, setError] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
<<<<<<< HEAD
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deletePassword, setDeletePassword] = useState('');
const [deleteEmail, setDeleteEmail] = useState('');
=======
>>>>>>> restore-point2

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

<<<<<<< HEAD
  const handleDeleteAccount = async () => {
    setShowDeleteModal(true);
  };
=======
>>>>>>> restore-point2

  const handleUpdateProfile = async () => {
    try {
      setError('');
      const updates: any = {};
      
      if (username) updates.username = username;
      if (selectedState) updates.state = selectedState;
      if (selectedCity) updates.city = selectedCity;

      if (Object.keys(updates).length === 0) {
        setError('No changes to update');
        return;
      }

      await updateProfile(updates);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleEditLocation = () => setIsEditingLocation((prev) => !prev);

  useEffect(() => {
    if (user?.userData?.demographics) {
      setSelectedState(user.userData.demographics.state);
      setSelectedCity(user.userData.demographics.city);
    }
  }, [user?.userData?.demographics]);

  return (
    <SafeLayout style={styles.container}>
      <View style={styles.header}>
        <Link href="/Settings" style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </Link>
        <Text style={styles.title}>Account Management</Text>
      </View>
      <ScrollSafeLayout style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Profile</Text>
          <UsernameInput 
            onUsernameChange={setUsername}
            defaultValue={user?.userData?.username}
            editable={false}
          />
            <Text style={styles.usernameNote}>You must wait six months to change your username</Text>
            {!isEditingLocation ? (
  <>
    {/* Header with the image and text */}
    <View style={styles.headerContainer}>
      <Image 
        source={require('../assets/images/house_emoji.png')} 
        style={styles.houseIcon} 
      />
      <Text style={styles.headerText}>Current Location:</Text>
    </View>

    {/* Location display */}
    <View style={styles.locationDisplayContainer}>
      <Text style={styles.locationText}>
        {selectedCity}, {selectedState}
      </Text>
    </View>

    {/* Change location button */}
    <TouchableOpacity
      style={styles.button}
      onPress={toggleEditLocation}
    >
      <Text style={styles.buttonText}>Change Location</Text>
    </TouchableOpacity>
  </>
) : (
  // Show dropdowns to edit location
  <>
    <StateDropdown 
      onStatesChange={setSelectedState}
      defaultValue={selectedState}
    />
    <CityDropdown 
      onCitiesChange={setSelectedCity}
      selectedState={selectedState}
      defaultValue={selectedCity}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        handleUpdateProfile();
        toggleEditLocation();
      }}
    >
      <Text style={styles.buttonText}>Save Location</Text>
    </TouchableOpacity>
  </>
)}
        </View>

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

            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            
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
<<<<<<< HEAD
            onPress={handleDeleteAccount}
=======
>>>>>>> restore-point2
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollSafeLayout>
<<<<<<< HEAD
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Please enter your email and password to confirm account deletion. 
              This action cannot be undone.
            </Text>
            <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={deleteEmail}
        onChangeText={setDeleteEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
            <PasswordInput
              onPasswordChange={setDeletePassword}
              placeholder="Enter your password"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
              >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={async () => {
            if (!deleteEmail || !deletePassword) {
              setError('Email and password are required');
              return;
            }
            try {
              await deleteUserAccount(deleteEmail, deletePassword);
              setShowDeleteModal(false);
              router.push('/OnboardingPage1');
            } catch (err: any) {
              setError(err.message);
            }
          }}
        >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>
      </Modal>
=======
>>>>>>> restore-point2
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  button: {
    backgroundColor: '#57C7FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 56,
  },
<<<<<<< HEAD
=======
  deleteButton: {
    backgroundColor: '#FF5757',
  },
>>>>>>> restore-point2
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  locationDisplayContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#aaa',
    paddingVertical: 6,
    paddingHorizontal: 16,  
    marginHorizontal: 56,   
},
  locationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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
    marginRight: 16,
  },
  forgotPasswordText: {
    color: '#a9a9a9',
    fontSize: 12,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  usernameNote: {
    color: '#a9a9a9',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: -8,
  },
  houseIcon: {
    width: 24, // Match the size specified in your example
    height: 24,
    marginRight: 8,
    marginLeft: 30, // Add spacing between the icon and the text
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
<<<<<<< HEAD
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingHorizontal: 16,
  },
  deleteButton: {
    backgroundColor: '#FF5757',
    paddingHorizontal: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  
=======
>>>>>>> restore-point2
});

export default AccountManagement;
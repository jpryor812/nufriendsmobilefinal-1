import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '@/contexts/AuthContext';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import SafeLayout from '@/components/SafeLayout';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import ProgressBar from '@/components/ProgressBar';

const OnboardingSignUp = () => {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = async () => {
    try {
      // Basic validation
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Basic password validation
      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      // Create account using anonymous auth
      await signup(email, password, email.split('@')[0]);
      router.push('/OnboardingBasicQuestions');
      
    } catch (err: any) {
      // Simpler error handling since we're using anonymous auth
      if (err.message === 'Email already exists') {
        setError('This email is already registered');
      } else {
        setError('Error creating account. Please try again');
      }
      console.error('Signup error:', err);
    }
  };

  return (
    <SafeLayout style={styles.container}>
      <ProgressBar progress={20} />
      <View style={styles.contentContainer}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
        >
          <SmallYuOnboarding text="But, first, let's create your nufriends account!" />
          <EmailInput onEmailChange={setEmail} />
          <PasswordInput onPasswordChange={setPassword} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </KeyboardAwareScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#F0FCFE',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#F0FCFE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    backgroundColor: '#57C7FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
export default OnboardingSignUp;
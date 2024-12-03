import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '@/contexts/AuthContext';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import SafeLayout from '@/components/SafeLayout';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // If successful, navigate to home or last screen
      router.replace('/(tabs)');
      
    } catch (err: any) {
      setError('Error signing in. Please try again');
      console.error('Signin error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeLayout style={styles.container}>
      <View style={styles.contentContainer}>
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={20}
        >
          <SmallYuOnboarding text="Welcome back to nufriends!" />
          <EmailInput onEmailChange={setEmail} />
          <PasswordInput onPasswordChange={setPassword} />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </KeyboardAwareScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button,
              loading && styles.buttonDisabled
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/OnboardingPreQuestionsCreateAccount')}
            style={styles.signUpLink}
          >
            <Text style={styles.signUpText}>
              Don't have an account? Create one
            </Text>
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
  buttonDisabled: {
    opacity: 0.7,
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
  signUpLink: {
    marginTop: 12,
    alignItems: 'center',
  },
  signUpText: {
    color: '#42ade2',
    fontSize: 14,
  },
});

export default SignIn;
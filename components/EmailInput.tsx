import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface EmailInputProps {
  onEmailChange: (email: string) => void;
}

const EmailInput = ({ onEmailChange }: EmailInputProps) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    onEmailChange(text);
    setIsValid(validateEmail(text));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, !isValid && email.length > 0 && styles.invalidInput]}
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Enter your email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      {!isValid && email.length > 0 && (
        <Text style={styles.errorText}>Please enter a valid email address</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default EmailInput;
// components/PasswordInput.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordInputProps {
  onPasswordChange: (password: string) => void;
  placeholder?: string; 
}

const PasswordInput = ({ onPasswordChange, placeholder = "Enter password (min 6 characters)" }: PasswordInputProps) => {
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    onPasswordChange(text);
    setIsValid(text.length >= 6);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !isValid && styles.invalidInput]}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons 
            name={showPassword ? "eye-off-outline" : "eye-outline"} 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {!isValid && password.length > 0 && (
        <Text style={styles.errorText}>Password must be at least 6 characters</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default PasswordInput;
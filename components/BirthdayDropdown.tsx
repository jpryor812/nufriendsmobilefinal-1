import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

interface AgePickerProps {
  onAgeChange: (data: {
    age: number;
    birthDate: number;
    isEligible: boolean;
  }) => void;
}

const AgePicker: React.FC<AgePickerProps> = ({ onAgeChange }) => {
  const [dateText, setDateText] = useState('');
  const [error, setError] = useState<string>('');

  const isValidDate = (month: number, day: number, year: number): boolean => {
    if (month < 1 || month > 12) return false;
    
    const date = new Date(year, month - 1, day);
    
    return date.getMonth() === month - 1 && 
           date.getDate() === day && 
           date.getFullYear() === year;
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (text: string) => {
    setDateText(text);
    
    if (text.length === 0) {
      setError('');
      return;
    }

    if (text.length < 10) return;

    const [month, day, year] = text.split('/').map(num => parseInt(num, 10));
    
    if (!month || !day || !year || !isValidDate(month, day, year)) {
      setError('Please enter a valid date in MM/DD/YYYY format');
      return;
    }

    const birthDate = new Date(year, month - 1, day);
    birthDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(maxDate.getFullYear() - 120);
    maxDate.setFullYear(maxDate.getFullYear() - 13);

    if (birthDate > maxDate) {
      setError('You must be at least 13 years old to use this app');
      return;
    }

    if (birthDate < minDate) {
      setError('Please enter a valid date (maximum age is 120)');
      return;
    }

    const calculatedAge = calculateAge(birthDate);
    setError('');

    onAgeChange({
      age: calculatedAge,
      birthDate: birthDate.getTime(),
      isEligible: calculatedAge >= 13
    });
  };

  const formatDateInput = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Birthday</Text>
      
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="MM/DD/YYYY"
        value={dateText}
        onChangeText={(text) => {
          const formatted = formatDateInput(text);
          if (formatted.length <= 10) {
            setDateText(formatted);
            handleDateChange(formatted);
          }
        }}
        keyboardType="numeric"
        maxLength={10}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#aaa',
    fontSize: 14,
    color: '#374151',
    marginHorizontal: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});

export default AgePicker;
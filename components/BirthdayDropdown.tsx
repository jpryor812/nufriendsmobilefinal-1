import React, { useState } from 'react';
import {
  View,
  Text,
<<<<<<< HEAD
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AgePickerProps {
    onAgeChange: (data: {
      age: number;
      birthDate: Date;
      isEligible: boolean;
    }) => void;
  }
  
  const AgePicker: React.FC<AgePickerProps> = ({ onAgeChange }) => {
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [age, setAge] = useState<number | null>(null);
  
    // Calculate minimum and maximum dates
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(maxDate.getFullYear() - 120); // Max age 120
    maxDate.setFullYear(maxDate.getFullYear() - 13);  // Min age 13
  
    const calculateAge = (birthDate: Date): number => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };
  
    const handleDateChange = (event: any, selectedDate?: Date) => {
      const currentDate = selectedDate || date;
      setShowPicker(Platform.OS === 'ios');
      setDate(currentDate);
      
      const calculatedAge = calculateAge(currentDate);
      setAge(calculatedAge);
      onAgeChange({ 
        age: calculatedAge,
        birthDate: currentDate,
        isEligible: calculatedAge >= 13
      });
    };
  
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    };
=======
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
>>>>>>> restore-point2

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Birthday</Text>
      
<<<<<<< HEAD
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>
          {age ? `${formatDate(date)} (${age} years old)` : 'Select your birthday'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <Modal
          transparent={true}
          visible={showPicker}
          animationType="slide"
        >
          <View style={styles.modalView}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity 
                  onPress={() => setShowPicker(false)}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Birthday</Text>
                <TouchableOpacity 
                  onPress={() => setShowPicker(false)}
                  style={styles.headerButton}
                >
                  <Text style={styles.headerButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maxDate}
                minimumDate={minDate}
              />
            </View>
          </View>
        </Modal>
      )}
      
      {age !== null && age < 13 && (
        <Text style={styles.errorText}>
          You must be at least 13 years old to use this app
        </Text>
      )}
=======
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
>>>>>>> restore-point2
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
<<<<<<< HEAD
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
  },
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
=======
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
>>>>>>> restore-point2
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
<<<<<<< HEAD
    marginTop: 8,
=======
    marginTop: 4,
>>>>>>> restore-point2
  },
});

export default AgePicker;
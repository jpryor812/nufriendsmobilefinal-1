import React, { useState } from 'react';
import {
  View,
  Text,
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Birthday</Text>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
});

export default AgePicker;
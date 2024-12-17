import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SafeLayout from '@/components/SafeLayout';

const AgePicker = () => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <SafeLayout>
      <Button onPress={() => setShow(true)} title="Show date picker" />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </SafeLayout>
  );
};

export default AgePicker;
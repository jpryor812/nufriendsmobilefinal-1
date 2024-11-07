import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import Colors from '@/assets/Colors';

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
    <View style={styles.container}>
      <Text style={styles.label}>Email Address</Text>
      <InputToolbar
        containerStyle={styles.inputContainer}
        primaryStyle={styles.inputPrimary}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={styles.input}
            text={email}
            onTextChanged={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            multiline={false}
          />
        )}
        renderSend={() => null}
        renderActions={() => null}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#aaa',
    minHeight: 36,
    maxHeight: 36,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 6,
    marginBottom: 6,
  },
});

export default EmailInput;
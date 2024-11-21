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

interface UsernameInputProps {
  onUsernameChange: (username: string) => void;
  defaultValue?: string;
<<<<<<< HEAD
  editable?: boolean;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  onUsernameChange,
  defaultValue,
  editable = true, // Default to editable
}) => {
  const [username, setUsername] = useState(defaultValue || '');

  const handleUsernameChange = (text: string) => {
    if (editable) {
      setUsername(text);
      onUsernameChange(text);
    }
=======
}

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernameChange, defaultValue }) => {
  const [username, setUsername] = useState(defaultValue || '');

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    onUsernameChange(text);
>>>>>>> restore-point2
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<<<<<<< HEAD
      <View style={[styles.container]}>
        <Text style={styles.label}>What Should Everyone Call You?</Text>
        <View pointerEvents={!editable ? 'none' : 'auto'}>
          <InputToolbar
            containerStyle={styles.inputContainer}
            primaryStyle={styles.inputPrimary}
            renderComposer={(props) => (
              <Composer
                {...props}
                textInputStyle={[
                  styles.input,
                  !editable && { color: '#aaa' }, // Gray out when non-editable
                ]}
                text={username}
                onTextChanged={handleUsernameChange}
                placeholder={editable ? 'Enter your username' : ''}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
                editable={editable}
              />
            )}
            renderSend={() => null}
            renderActions={() => null}
          />
        </View>
=======
      <View style={styles.container}>
        <Text style={styles.label}>What Should Everyone Call You?</Text>
        <InputToolbar
          containerStyle={styles.inputContainer}
          primaryStyle={styles.inputPrimary}
          renderComposer={(props) => (
            <Composer
              {...props}
              textInputStyle={styles.input}
              text={username}  // Changed from UserName to username
              onTextChanged={handleUsernameChange}  // Changed from setUserName
              placeholder="Enter your username"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={false}
            />
          )}
          renderSend={() => null}
          renderActions={() => null}
        />
>>>>>>> restore-point2
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 8,
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  Sublabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: -2,
    marginLeft: 12,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderTopWidth: 2,
    borderColor: '#aaa',
    minHeight: 32,
    maxHeight: 32,
    marginTop: 4,
    marginBottom: 6,
  },
  inputPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 16,
    marginRight: 10,
  },
});

export default UsernameInput;
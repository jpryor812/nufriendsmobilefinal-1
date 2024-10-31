import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, Keyboard, Animated, Dimensions, KeyboardEvent, KeyboardAvoidingView } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface InputContainerProps {
  onSendMessage: (message: string) => void;
  onHeightChange: (height: number) => void;
  width?: string | number;
  maxHeight?: number;
}

const InputContainer: React.FC<InputContainerProps> = ({ onSendMessage, onHeightChange }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const inputContainerPosition = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    onHeightChange(inputHeight); // 20 for padding
  }, [inputHeight, onHeightChange]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const keyboardWillShow = (event: KeyboardEvent) => {
    Animated.timing(inputContainerPosition, {
      toValue: -event.endCoordinates.height,
      duration: event.duration || 250,
      useNativeDriver: false, // Can't use native driver for 'bottom' property
    }).start();
  };

  const keyboardWillHide = (event: KeyboardEvent) => {
    Animated.timing(inputContainerPosition, {
      toValue: 0,
      duration: event.duration || 250,
      useNativeDriver: false, // Can't use native driver for 'bottom' property
    }).start();
  };

  const handleContentSizeChange = (event: any) => {
    const newHeight = Math.min(100, Math.max(40, event.nativeEvent.contentSize.height));
    setInputHeight(newHeight);
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      setInputHeight(40);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <Animated.View 
        style={[
          styles.inputContainer, 
          { 
            height: inputHeight, 
            bottom: inputContainerPosition.interpolate({
              inputRange: [-SCREEN_HEIGHT, 0],
              outputRange: ['0%', '2%'],
              extrapolate: 'clamp',
            })
          }
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: inputHeight }]}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          onContentSizeChange={handleContentSizeChange}
          accessibilityLabel="Message input"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} accessibilityLabel="Send message">
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    justifyContent: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 10,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4EBCEF',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default InputContainer;
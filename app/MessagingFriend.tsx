import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MessageContainer from '../components/MessageContainer';
import InputContainer from '../components/InputContainer';
import FooterNavigation from '../components/FooterNavigationIOS';
import FriendProfile from '../components/FriendProfile';
import SafeLayout from '@/components/SafeLayout';

// Define our message interface
interface Message {
  id: string;
  text: string;
  isSent: boolean;
}

const MessagingFriend = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputHeight, setInputHeight] = useState(60);


  // Handle sending new messages
  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isSent: true
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeLayout style={styles.container}>
        <FriendProfile imageSource={0} name={''} />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={{ flex: 1 }}>
          <MessageContainer 
            messages={messages}
            style={{ marginBottom: inputHeight }}
          />
        </View>
      </TouchableWithoutFeedback>
      <InputContainer
        onSendMessage={handleSendMessage}
        onHeightChange={setInputHeight}
      />
      <FooterNavigation />
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
});

export default MessagingFriend;
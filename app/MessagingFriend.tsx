import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MessageContainer from '../components/MessageContainer';
import InputContainer from '../components/InputContainer';
import FooterNavigation from '../components/FooterNavigation';
import FriendProfile from '../components/FriendProfile';

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
    <SafeAreaView style={styles.container}>
        <FriendProfile 
            imageSource={require('../assets/images/yu_progress_bar.png')} // or whatever your image path is
            name="Yu :)" // or whatever name you want to display
            />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
});

export default MessagingFriend;
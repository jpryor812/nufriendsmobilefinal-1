import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import MessageContainer from '../components/MessageContainer';
import InputContainer from '../components/InputContainer';
import FooterNavigation from '../components/FooterNavigation';
import FriendProfile from '../components/FriendProfile';

// Define our message interface
interface Message {
  id: string;
  text: string;
  isSent: boolean;
  opacity?: Animated.Value;
}

const MessagingYu = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputHeight, setInputHeight] = useState(10);
  
    useEffect(() => {
      // Set initial messages all at once instead of with delays
      setMessages([
        {
          id: '1',
          text: "Hi! You can use this space to ask me questions about yourself. You can ask questions like:",
          isSent: false
        },
        {
          id: '2',
          text: "1. What should I say as a fun fact for me at school?",
          isSent: false
        },
        {
          id: '3',
          text: "2. Is there anything interesting about me I can say at an upcoming networking event?",
          isSent: false
        },
        {
          id: '4',
          text: "3. I sit next to this girl in class and I know she likes anime like me, but I can't get myself to start a conversation with her. How can I start a conversation with her about anime?",
          isSent: false
        },
        {
          id: '5',
          text: "These are all just example questions. Use the text box below to ask anything you want!",
          isSent: false
        }
      ]);
    }, []);
  
 const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isSent: true
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FriendProfile 
        imageSource={require('../assets/images/yu_progress_bar.png')}
        name="Yu :)"
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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

export default MessagingYu;
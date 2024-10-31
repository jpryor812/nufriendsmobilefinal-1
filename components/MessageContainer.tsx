import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, Keyboard, Platform, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.7; // 70% of screen height
const KEYBOARD_HEIGHT = SCREEN_HEIGHT * 0.4; // Approximate keyboard height

interface Message {
  id: string;
  text: string;
  isSent: boolean;
  opacity?: Animated.Value;
}

interface MessageContainerProps {
  messages: Message[];
  style?: object;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages = [], style }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const containerHeight = useRef(new Animated.Value(DEFAULT_HEIGHT)).current;

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        Animated.timing(containerHeight, {
          toValue: KEYBOARD_HEIGHT,
          duration: event.duration || 250,
          useNativeDriver: false,
        }).start(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event) => {
        Animated.timing(containerHeight, {
          toValue: DEFAULT_HEIGHT,
          duration: event.duration || 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageWrapper,
        message.isSent ? styles.sentWrapper : styles.receivedWrapper,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isSent ? styles.sentText : styles.receivedText,
          ]}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, style, { height: containerHeight }]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
      >
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map(renderMessage)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#EBF7FE',
  },
  scrollContent: {
    paddingVertical: 8,
    flexGrow: 1, // Add this
    justifyContent: 'flex-end',
  },
  messageWrapper: {
    flexDirection: 'row',
    padding: 8,
  },
  sentWrapper: {
    justifyContent: 'flex-end',
  },
  receivedWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: '#4EBCEF',
    borderBottomRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: '#ECECEC',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    padding: 4,
    alignItems: 'center',
  },
  sentText: {
    color: '#F1F3F5',
  },
  receivedText: {
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    alignItems: 'center',
  },
});

export default MessageContainer;
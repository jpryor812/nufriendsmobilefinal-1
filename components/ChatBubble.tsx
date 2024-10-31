import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatBubbleProps {
  text: string;
  small?: boolean;
  style?: any;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, small = false }) => {
  return (
    <View style={[styles.container, small && styles.smallContainer]}>
      <View style={[styles.chatBubble, small && styles.smallChatBubble]}>
        <Text style={[styles.chatBubbleText, small && styles.smallText]}>{text}</Text>
      </View>
      <View style={styles.chatBubbleArrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
  },
  smallContainer: {
    width: '80%',
  },
  chatBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#bbb',
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallChatBubble: {
    padding: 10,
  },
  chatBubbleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#42ade2',
  },
  smallText: {
    fontSize: 20
  },
  chatBubbleArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    alignSelf: 'center',
    marginTop: -2,
  },
});

export default ChatBubble;
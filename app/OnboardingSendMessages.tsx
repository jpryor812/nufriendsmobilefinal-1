import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import messageData from '@/assets/messages2.json';
import { useLocalSearchParams } from 'expo-router';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import MessageContainer from '@/components/MessageContainer';

const ChatRoomFriend = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<IMessage[]>([]);
  const [animatedMessages, setAnimatedMessages] = useState<{
    message: IMessage;
    opacity: Animated.Value;
  }[]>([]);

  useEffect(() => {
    // First, prepare all messages
    const allMessages = messageData.map((message) => ({
      _id: message.id,
      text: message.msg,
      createdAt: new Date(message.date),
      user: {
        _id: message.from,
        name: message.from ? 'You' : 'Jpp123',
      },
    }));

    const addMessagesWithDelay = (messages: IMessage[], index: number) => {
        if (index >= messages.length) {
          setIsLoadingMessages(false);
          return;
        }

        const opacity = new Animated.Value(0);

        setTimeout(() => {
          setAnimatedMessages(prev => [...prev, { message: messages[index], opacity }]);
          
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start();

          addMessagesWithDelay(messages, index + 1);
        }, 1200); // 1 second delay
      };
  
      // Start adding messages
      addMessagesWithDelay(allMessages, 0);
  
      // Cleanup function
      return () => {
        setDisplayedMessages([]);
        setIsLoadingMessages(true);
      };
    }, []); // Empty dependency array since we only want this to run once

    const renderMessage = (props: any) => {
        const messageAnimation = animatedMessages.find(
          am => am.message._id === props.currentMessage._id
        );
    
        return (
          <Animated.View style={{ opacity: messageAnimation?.opacity || 1 }}>
            <ChatMessageBox {...props} />
          </Animated.View>
        );
      };
  
    const onSend = useCallback((messages = []) => {
      setDisplayedMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, []);

  const handleYuSuggestionsSelect = (content: string) => {
    setText(content);
    setIsYuSuggestionsMode(false);
  };

  // Combined handler for Yu-generated messages
  const handleYuMessage = (text: string) => {
    console.log('ChatRoomFriend received message:', text);
    
    const newMessage: IMessage = {
      _id: Math.random().toString(),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'You',
      },
    };
    setDisplayedMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Changed from setMessages to setDisplayedMessages
    setIsYuSuggestionsMode(false);
  };

  const renderInputToolbar = (props: any) => {
    if (isYuSuggestionsMode) {
      return (
        <YuSuggestions
          onSelectContent={handleYuMessage}
          onClose={() => setIsYuSuggestionsMode(false)}
        />
      );
    }

    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.background }}
        renderActions={() => (
          <AnimatedYuButton onPress={() => setIsYuSuggestionsMode(true)} />
        )}
        renderSend={(props) => (
          <View style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 6,
          }}>
            <Send {...props} containerStyle={{ justifyContent: 'center' }}>
              <Ionicons name="send" color={Colors.primary} size={22} />
            </Send>
            <Ionicons name="add" color={Colors.primary} size={22} />
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
      >
        <FriendProfileMessageHeader 
          imageSource={require('../assets/images/profile_picture.jpg')}
          name= "Jpp123"
        />
        
        <GiftedChat
        messages={animatedMessages.map(am => am.message)} // Changed this line
        onSend={onSend}
        user={{ _id: 1 }}
        inverted={false}
        isKeyboardInternallyHandled={true}
        keyboardShouldPersistTaps="handled"
        listViewProps={{
            scrollEnabled: true,
            keyboardDismissMode: 'on-drag',
            keyboardShouldPersistTaps: 'handled',
        }}
        minInputToolbarHeight={36}
        maxInputToolbarHeight={100}
        minComposerHeight={36}
        renderSystemMessage={(props) => (
            <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
        )}
        bottomOffset={insets.bottom - 36}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={styles.composer}
        renderBubble={(props) => (
            <Bubble
            {...props}
            textStyle={{
                right: { color: '#fff' },
            }}
            wrapperStyle={{
                left: { backgroundColor: '#eee' },
                right: { backgroundColor: '#6ecfff'},
            }}
            />
        )}
        renderInputToolbar={renderInputToolbar}
        renderMessage={(props) => {
            const messageAnimation = animatedMessages.find(
            am => am.message._id === props.currentMessage._id
            );

            return (
            <Animated.View 
                style={{ 
                marginBottom: 6,
                opacity: messageAnimation?.opacity || 1 
                }}
            >
                <ChatMessageBox {...props} />
            </Animated.View>
            );
        }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  yuButton: {
    height: 44,
    justifyContent: 'center',
    paddingLeft: 12,
    marginTop: 4,
  },
  yuImage: {
    width: 40,
    height: 40,
  },
  composer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    textAlignVertical: 'center',
  },
});

export default ChatRoomFriend;
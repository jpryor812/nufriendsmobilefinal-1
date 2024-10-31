import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import messageData from '@/assets/messages.json';
import { Link } from 'expo-router';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';

const ChatRoomYu = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setMessages([
      ...messageData.map((message) => {
        return {
          _id: message.id,
          text: message.msg,
          createdAt: new Date(message.date),
          user: {
            _id: message.from,
            name: message.from ? 'You' : 'Bob',
          },
        };
      }),
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages: any[]) => GiftedChat.append(previousMessages, messages));
  }, []);

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.background }}
        renderActions={null}  // Remove the + sign from left
        renderSend={(props) => (
          <View style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 6,
          }}>
            <Ionicons name="add" color={Colors.primary} size={28} />
            {text === '' && (
              <>
              </>
            )}
            {text !== '' && (
              <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                <Ionicons name="send" color={Colors.primary} size={28} />
              </Send>
            )}
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ImageBackground
        style={{
          flex: 1,
          backgroundColor: Colors.background,
        }}
      >
        <FriendProfileMessageHeader 
          imageSource={require('../assets/images/yu_progress_bar.png')} // or whatever your image path is
          name="Yu :)" // or whatever name you want to display
        />
        <GiftedChat
          messages={messages}
          onSend={(messages: any) => onSend(messages)}
          onInputTextChanged={setText}
          user={{ _id: 1 }}
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
          bottomOffset={insets.bottom - 36} // Adjusted bottomOffset to move the input container up slightly
          renderAvatar={null}
          maxComposerHeight={100}
          textInputProps={styles.composer}
          renderBubble={(props) => (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: '#fff',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#eee',
                },
                right: {
                  backgroundColor: '#6ecfff',
                },
              }}
            />
          )}
          renderInputToolbar={renderInputToolbar}
          renderMessage={(props) => (
            <ChatMessageBox {...props} />
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  composer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    textAlignVertical: 'center', // Center text vertically
  },
});

export default ChatRoomYu;
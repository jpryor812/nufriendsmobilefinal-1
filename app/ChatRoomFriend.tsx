import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text } from 'react-native';
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
import { useLocalSearchParams } from 'expo-router';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';

const ChatRoomFriend = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { userId, username, avatar } = useLocalSearchParams();

  const getAvatarImage = () => {
    if (avatar) {
        return JSON.parse(avatar as string);
      }};
  
  useEffect(() => {
    console.log('Received params:', { userId, username });
}, [userId, username]);

useEffect(() => {
    setMessages([
      ...messageData.map((message) => {
        return {
          _id: message.id,
          text: message.msg,
          createdAt: new Date(message.date),
          user: {
            _id: message.from,
            name: message.from ? 'You' : username as string,
          },
        };
      }),
    ]);
  }, [username]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages: any[]) => GiftedChat.append(previousMessages, messages));
  }, []);

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.background }}
        renderActions={() => (  // Changed from null to a function
          <View style={{
            height: 44,
            justifyContent: 'center',
            paddingLeft: 12,
            marginTop: 4,
          }}>
            <Image 
              source={require('../assets/images/yu_question_onboarding.png')} // Replace with your image path
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
              }}
            />
          </View>
        )}
        renderSend={(props) => (
          <View style={{
            height: 44,
            marginTop: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            paddingHorizontal: 2,
          }}>
            <Ionicons name="add" color={Colors.primary} size={28} />
            {text === '' && (
              <>
              </>
            )}
            {text !== '' && (
              <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                <Ionicons name="send" color={Colors.primary} size={22} />
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
        imageSource={getAvatarImage()}
        name={username as string} // Use the username from params
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

export default ChatRoomFriend;
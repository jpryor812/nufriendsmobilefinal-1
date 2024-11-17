import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Animated } from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import messageData2 from '@/assets/messages2.json';
import { useLocalSearchParams } from 'expo-router';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import SafeLayout from '@/components/SafeLayout';
import { friendsData } from '@/constants/FriendsData';
import ActionMenu from '@/components/ActionMenu';

const generateMessageId = (() => {
  let counter = 1;
  return () => `m_${Date.now()}_${counter++}`;
})();

const ChatRoomFriend = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const params = useLocalSearchParams();
  const friend = friendsData.find(f => f.id === Number(params.id));


  if (!friend) return null;

  useEffect(() => {
    console.log('Received params:', { id: params.id, name: friend.name });
  }, [params.id, friend.name]);

  useEffect(() => {
    const formattedMessages = messageData2.map((message) => ({
      _id: generateMessageId(),
      text: message.msg,
      createdAt: new Date(message.date),
      user: {
        _id: message.from,
        name: message.from ? 'You' : friend.name,
      },
    }));
    setMessages(formattedMessages.reverse());
  }, [friend.name]);

const onSend = useCallback((newMessages: IMessage[] = []) => {
  console.log('Regular send triggered:', newMessages);
  
  try {
    // Create a properly structured message similar to Yu messages
    const formattedMessages = newMessages.map(msg => ({
      _id: generateMessageId(),
      text: msg.text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'You'
      }
    }));

    console.log('Formatted messages:', formattedMessages);
    setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessages));
  } catch (error) {
    console.error('Error in onSend:', error);
  }
}, []);

  // Combined handler for Yu-generated messages
  const handleYuMessage = (text: string) => {
    const newMessage: IMessage = {
      _id: generateMessageId(),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'You',
      },
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
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
                  <ActionMenu />
              </View>
        )}
      />
    );
  };

  return (
    <SafeLayout style={styles.container}>
            <FriendProfileMessageHeader
                id={friend.id}
                name={friend.name}
                avatar={friend.avatar}
            />
        
        <GiftedChat
          messages={messages}
          onSend={onSend}
          inverted={true}
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
                right: { backgroundColor: '#6ecfff' },
              }}
            />
          )}
          renderInputToolbar={renderInputToolbar}
          renderMessage={(props) => (
            <View style={{ paddingVertical: 4, paddingHorizontal: 6 }}>
              <ChatMessageBox {...props} />
            </View>
          )}
        />
    </SafeLayout>
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
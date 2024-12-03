import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMessaging } from '@/contexts/MessageContext'; 
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/assets/Colors';
import ChatMessageBox from '@/components/ChatMessageBox';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import SafeLayout from '@/components/SafeLayout';
import ActionMenu from '@/components/ActionMenu';

const ChatRoomFriend = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { 
    sendMessage, 
    currentConversation,
    markConversationAsRead,
    setTypingStatus 
  } = useMessaging();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const params = useLocalSearchParams();
  const friend = friendsData.find(f => f.id === Number(params.id));

  if (!friend) return null;

  // Subscribe to messages from Firebase
  useEffect(() => {
    if (!currentConversation?.id || !user?.uid) return;

    const messagesRef = collection(db, `conversations/${currentConversation.id}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: IMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.content,
          createdAt: data.timestamp.toDate(),
          user: {
            _id: data.senderId,
            name: data.senderId === user.uid ? 'You' : friend?.name
          },
          messageType: data.type
        };
      });

      setMessages(newMessages);
    });

    // Mark conversation as read when opened
    markConversationAsRead(currentConversation.id);

    return () => unsubscribe();
  }, [currentConversation?.id, user?.uid]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!currentConversation?.id) return;

    try {
      const [firstMessage] = newMessages;
      await sendMessage(
        currentConversation.id,
        firstMessage.text,
        'text'
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [currentConversation?.id, sendMessage]);

  const handleYuMessage = async (text: string) => {
    if (!currentConversation?.id) return;

    try {
      await sendMessage(
        currentConversation.id,
        text,
        'ai_generated'
      );
      setIsYuSuggestionsMode(false);
    } catch (error) {
      console.error('Error sending Yu message:', error);
    }
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
          <View style={styles.sendContainer}>
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
        user={{ _id: user?.uid || '' }}
        onInputTextChanged={(text) => {
          if (currentConversation?.id) {
            setTypingStatus(currentConversation.id, text.length > 0);
          }
        }}
        inverted={true}
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
        maxComposerHeight={100}
        bottomOffset={insets.bottom - 36}
        renderAvatar={null}
        textInputProps={styles.composer}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
        )}
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
          <View style={styles.messageContainer}>
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
  sendContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },
  messageContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
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
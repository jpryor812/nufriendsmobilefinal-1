import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/assets/Colors';
import ChatMessageBox from '@/components/ChatMessageBox';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import SafeLayout from '@/components/SafeLayout';

const YU_ID = 'yu_companion';

const ChatRoomYu = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user?.uid) return;

    const yuChatRef = collection(db, `users/${user.uid}/yu_chat`);
    const q = query(yuChatRef, orderBy('timestamp', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.content,
          createdAt: data.timestamp.toDate(),
          user: {
            _id: data.senderId,
            name: data.senderId === YU_ID ? 'Yu' : 'You'
          }
        };
      });
      setMessages(newMessages);
    });
  }, [user?.uid]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!user?.uid || isLoading) return;

    try {
      setIsLoading(true);
      const [userMessage] = newMessages;
      
      // Store user message
      const yuChatRef = collection(db, `users/${user.uid}/yu_chat`);
      await addDoc(yuChatRef, {
        content: userMessage.text,
        timestamp: serverTimestamp(),
        senderId: user.uid,
      });

      // Get AI response
      const aiResponse = await generateYuResponse(userMessage.text, user.uid);
      
      // Store AI response
      await addDoc(yuChatRef, {
        content: aiResponse,
        timestamp: serverTimestamp(),
        senderId: YU_ID,
      });

    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, isLoading]);

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{ backgroundColor: Colors.background }}
      renderSend={(props) => (
        <View style={styles.inputContainer}>
          {text !== '' && (
            <Send {...props} containerStyle={{ justifyContent: 'center' }}>
              <Ionicons 
                name="send" 
                color={Colors.primary} 
                size={28} 
                style={{ opacity: isLoading ? 0.5 : 1 }} 
              />
            </Send>
          )}
        </View>
      )}
    />
  );

  return (
    <SafeLayout style={styles.container} hasTabBar>
      <FriendProfileMessageHeader 
        imageSource={require('@/assets/images/yu_progress_bar.png')}
        name="Yu :)"
      />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user?.uid || '' }}
        onInputTextChanged={setText}
        renderInputToolbar={renderInputToolbar}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: { color: '#fff' } }}
            wrapperStyle={{
              left: { backgroundColor: '#eee' },
              right: { backgroundColor: '#6ecfff' },
            }}
          />
        )}
        renderMessage={(props) => (
          <View style={styles.messageContainer}>
            <ChatMessageBox {...props} />
          </View>
        )}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
        )}
        isKeyboardInternallyHandled={true}
        bottomOffset={insets.bottom - 36}
        renderAvatar={null}
        minInputToolbarHeight={36}
        maxInputToolbarHeight={100}
        minComposerHeight={36}
        maxComposerHeight={100}
        textInputProps={styles.composer}
      />
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inputContainer: {
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

export default ChatRoomYu;
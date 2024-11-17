import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
} from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import SafeLayout from '@/components/SafeLayout';
import { friendsData } from '@/constants/FriendsData';
import messageData2 from '@/assets/messages2.json';

const ChatRoomNewFriend = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const params = useLocalSearchParams();
  const friend = friendsData.find(f => f.id === Number(params.id));
  const [animatedMessages, setAnimatedMessages] = useState<{
    message: IMessage;
    opacity: Animated.Value;
  }[]>([]);

  if (!friend) return null;

  // Log params when they change
  useEffect(() => {
    console.log('Received params:', { id: params.id, name: friend.name });
  }, [params.id, friend.name]);

  // Initialize and animate messages
  useEffect(() => {
    // Clear any existing messages
    setAnimatedMessages([]);
  
    const initialMessages = messageData2.map((message) => ({
      _id: message.id,
      text: message.msg,
      createdAt: new Date(message.date),
      user: {
        _id: message.from,
        name: message.from ? 'You' : friend.name,
      },
    }));
  
    const addMessagesWithDelay = (messages: IMessage[], index: number) => {
        if (index >= messages.length) return;
    
        const opacity = new Animated.Value(0);
        setTimeout(() => {
          setAnimatedMessages(prev => [{ 
            message: messages[index], 
            opacity 
          }, ...prev]);
        
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
  
        addMessagesWithDelay(messages, index + 1);
      }, 1500);
    };

    addMessagesWithDelay(initialMessages, 0);
  }, [friend.name]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const messagesToAdd = newMessages.map(message => ({
      message,
      opacity: new Animated.Value(1)
    }));
    
    setAnimatedMessages(prev => [...messagesToAdd, ...prev]);
  }, []);

  const handleYuMessage = (text: string) => {
    const newMessage: IMessage = {
      _id: Math.random().toString(),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'You',
      },
    };

    const opacity = new Animated.Value(1);
    setAnimatedMessages(prev => [{
      message: newMessage,
      opacity
    }, ...prev]);
    
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
    <SafeLayout style={styles.container}>
      <FriendProfileMessageHeader
        id={friend.id}
        name={friend.name}
        avatar={friend.avatar}
      />
      
      <GiftedChat
        messages={animatedMessages.map(am => am.message)}
        onSend={onSend}
        user={{ _id: 1 }}
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
          <Animated.View 
            style={{ 
              opacity: animatedMessages.find(am => 
                am.message._id === props.currentMessage._id
              )?.opacity || 1,
              paddingVertical: 4,
              paddingHorizontal: 6,
            }}
          >
            <ChatMessageBox {...props} />
          </Animated.View>
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

export default ChatRoomNewFriend;
import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
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
import FriendProfileMessageHeaderOnboarding from '@/components/FriendProfileMessageHeaderOnboarding';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import MessageContainer from '@/components/MessageContainer';
import BigYuOnboardingPlusContinue from '@/components/BigYuOnboardingPlusContinue';
import {router} from 'expo-router';
import SafeLayout from '@/components/SafeLayout';


const SCREEN_HEIGHT = Dimensions.get('window').height;

const ChatRoomFriendOnboarding = () => {
    const [text, setText] = useState('');
    const insets = useSafeAreaInsets();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
    const [displayedMessages, setDisplayedMessages] = useState<IMessage[]>([]);
    const [animatedMessages, setAnimatedMessages] = useState<{
      message: IMessage;
      opacity: Animated.Value;
    }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showBigYu, setShowBigYu] = useState(false);
    const bigYuAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const handleContinue = () => {
        router.push('/OnboardingMessageWithYuSuggestions'); // Replace with your actual route
      };
  
    const simulateTypingAndSend = (messageToType: string) => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= messageToType.length) {
          setText(messageToType.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          const newMessage: IMessage = {
            _id: Math.random().toString(),
            text: messageToType,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'You',
            },
          };
  
          const opacity = new Animated.Value(0);
          setAnimatedMessages(prev => [...prev, { message: newMessage, opacity }]);
          
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start(() => {

          setTimeout(() => {
            setShowBigYu(true);
            Animated.spring(bigYuAnimation, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }).start();
          }, 2000);
        });
  
          setText('');
        }
      }, 120);
    };
  
    useEffect(() => {
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
          // Start typing animation after messages are loaded
          setTimeout(() => {
            simulateTypingAndSend("Oh wow! Good luck!!");
          }, 2000);
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
        }, 1200);
      };
  
      addMessagesWithDelay(allMessages, 0);
  
      return () => {
        setDisplayedMessages([]);
        setIsLoadingMessages(true);
      };
    }, []);
  
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
  
      const opacity = new Animated.Value(0);
      setAnimatedMessages(prev => [...prev, { message: newMessage, opacity }]);
      
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
  
      setIsYuSuggestionsMode(false);
    };

// Modify renderInputToolbar to show the typing text
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
      text={text} // Add this line to show the typing text
      containerStyle={{ backgroundColor: Colors.background }}
      textInputProps={{
        ...props.textInputProps,
        editable: !isTyping, // Disable input while typing animation is happening
        value: text, // Add this to ensure text shows while typing
      }}
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
      <ImageBackground
        style={styles.background}
      >
        <FriendProfileMessageHeaderOnboarding 
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
                    {showBigYu && (
                <Animated.View
                  style={[
                    styles.bigYuContainer,
                    {
                      transform: [{ translateY: bigYuAnimation }],
                    },
                  ]}
                >
                  <BigYuOnboardingPlusContinue 
                    text="If you're still not sure what to say after I help start the conversation for you, I have another way to help you continue the conversation. Let's check it out!" // Or whatever text you want to display
                    onContinue={handleContinue}
                  />
                </Animated.View>
            )}

      </ImageBackground>
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
  bigYuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Optional: add semi-transparent background
  },
});

export default ChatRoomFriendOnboarding;
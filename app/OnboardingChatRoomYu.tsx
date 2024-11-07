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
import messageDataYu from '@/assets/messagesYu.json';
import { useLocalSearchParams } from 'expo-router';
import FriendProfileMessageHeaderOnboarding from '@/components/FriendProfileMessageHeaderOnboarding';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import MessageContainer from '@/components/MessageContainer';
import BigYuOnboardingPlusContinue from '@/components/BigYuOnboardingPlusContinue';
import {router} from 'expo-router';


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
    const bigYuAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const [showBigYu, setShowBigYu] = useState(false);
    const chatOpacity = useRef(new Animated.Value(1)).current; // Add this for fade effect



    const handleContinue = () => {
        router.push('/OnboardingPreAvatarBuild'); // Replace with your actual route
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
                const receivedMessage: IMessage = {
                  _id: Math.random().toString(),
                  text: "Don't hide who you are! Your interests make you unique and interesting. College is a great place to find people who share your passions. Be authentic and you'll attract friends who appreciate the real you. 😊",
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'Yu',
                  },
                };
  
                const receivedOpacity = new Animated.Value(0);
                setAnimatedMessages(prev => [...prev, { message: receivedMessage, opacity: receivedOpacity }]);
                
                Animated.timing(receivedOpacity, {
                  toValue: 1,
                  duration: 500,
                  easing: Easing.ease,
                  useNativeDriver: true,
                }).start(() => {
                  setTimeout(() => {
                    setShowBigYu(true);
                    // Animate both the BigYu slide-in and chat fade simultaneously
                    Animated.parallel([
                      Animated.spring(bigYuAnimation, {
                        toValue: 0,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                      }),
                      Animated.timing(chatOpacity, {
                        toValue: 0.5, // This controls how faded the chat becomes (0 = invisible, 1 = fully visible)
                        duration: 300,
                        easing: Easing.ease,
                        useNativeDriver: true,
                      })
                    ]).start();
                  }, 4000);
                });
              }, 4000);
            });
  
            setText('');
          }
        }, 30);
      };

    useEffect(() => {
      const allMessages = messageDataYu.map((message) => ({
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
            simulateTypingAndSend("I have college orientation coming up and I'm nervous about meeting new people. I'm afraid they'll think I'm weird because of my interests. Should I hide them and just try to fit in?");
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
        }, 2000);
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
    return (
      <InputToolbar
        {...props}
        text={text}
        containerStyle={{ backgroundColor: Colors.background }}
        textInputProps={{
          ...props.textInputProps,
          editable: !isTyping,
          value: text,
        }}
        renderSend={(props) => (
          <View style={{
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 6,
            paddingVertical: 6,
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
    <ImageBackground style={styles.background}>
      <FriendProfileMessageHeaderOnboarding 
        imageSource={require('../assets/images/yu_progress_bar.png')}
        name="Yu :)"
      />
      
      <Animated.View style={{ flex: 1, opacity: chatOpacity }}>
      <GiftedChat
        messages={animatedMessages.map(am => am.message)}
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
        maxInputToolbarHeight={120}
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
        </Animated.View>
      {showBigYu && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 100,
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transform: [{ translateY: bigYuAnimation }],
              }}
            >
              <BigYuOnboardingPlusContinue 
                text="As I said, I'll always be with you if needed :)" // Or whatever text you want to display
              onContinue={handleContinue} />
            </Animated.View>
          )}
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
    paddingVertical: 6,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
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
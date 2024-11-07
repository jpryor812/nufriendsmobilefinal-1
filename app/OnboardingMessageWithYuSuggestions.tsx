import ChatMessageBox from '@/components/ChatMessageBox';
import Colors from '@/assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
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
import FriendProfileMessageHeaderOnboarding from '@/components/FriendProfileMessageHeaderOnboarding';
import YuSuggestionsOnboarding from '@/components/YuSuggestionsOnboarding';
import AnimatedYuButtonOnboarding from '@/components/AnimatedYuButtonOnboarding';
import BigYuOnboardingSuggestionHelp from '@/components/BigYuOnboardingSuggestionHelp';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const OnboardingMessageWithYuSuggestions = () => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { userId, username, avatar } = useLocalSearchParams();
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const [showCenterImage, setShowCenterImage] = useState(false);
  const centerImageAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  
  const getAvatarImage = () => {
    if (avatar) {
        return JSON.parse(avatar as string);
      }};
  
  useEffect(() => {
    console.log('Received params:', { userId, username });
}, [userId, username]);

useEffect(() => {
    if (isYuSuggestionsMode) {
      setTimeout(() => {
        setShowCenterImage(true);
        Animated.spring(centerImageAnimation, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }, 1000);
    } else {
      setShowCenterImage(false);
      centerImageAnimation.setValue(SCREEN_HEIGHT);
    }
  }, [isYuSuggestionsMode]);

useEffect(() => {
    setMessages([
      ...messageData2.map((message) => {
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

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages: any[]) => GiftedChat.append(previousMessages, messages));
  }, []);

  const handleYuSuggestionsSelect = (content: string) => {
    setText(content);
    setSuggestionSelected(true);
    
    const newMessage: IMessage = {
      _id: Math.random().toString(),
      text: content,
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
        <YuSuggestionsOnboarding
          onSelectContent={handleYuSuggestionsSelect}
          onClose={() => setIsYuSuggestionsMode(false)}
          onSelectionChange={setSuggestionSelected}  // Add this
        />
      );
    }

    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.background }}
        renderActions={() => (
          <AnimatedYuButtonOnboarding onPress={() => setIsYuSuggestionsMode(true)} />
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
        <FriendProfileMessageHeaderOnboarding 
          imageSource={require('../assets/images/profile_picture.jpg')}
          name= "Jpp123"
        />
        
        <GiftedChat
          messages={messages}
          onSend={onSend}
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
            <View style={{ marginBottom: 6 }}>
            <ChatMessageBox {...props} />
            </View>
            )}
        />  
    {showCenterImage && (
      <Animated.View
        style={[
          styles.centerContainer,
          {
            transform: [{ translateY: centerImageAnimation }],
          },
        ]}
        pointerEvents="box-none" 
      >
        <BigYuOnboardingSuggestionHelp 
          text={suggestionSelected 
            ? "After you make a selection, I'll provide you an example response that you can directly edit, send as is, or make general suggestions that I'll use to write up a new message. \n\nLet's just send this message as is for now to get you closer to finding your new friends!"
            : "Based on what I know about you and your new friend, I'll always be here to help you drive existing and new conversations if needed. These suggestions will always be unique based on the conversation and constantly updated. Tap a suggestion below to see what happens next!"
          }
        />
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
    paddingVertical: 4,
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    textAlignVertical: 'center',
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingMessageWithYuSuggestions;
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  SystemMessage,
  IMessage,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/assets/Colors';
import ChatMessageBox from '@/components/ChatMessageBox';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import YuSuggestions from '@/components/YuSuggestions';
import AnimatedYuButton from '@/components/AnimatedYuButton';
import SafeLayout from '@/components/SafeLayout';
import ActionMenu from '@/components/ActionMenu';
import { friendsData } from '@/constants/FriendsData';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  DocumentData,
  getDoc,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useMessaging } from '@/contexts/MessageContext';
import { Audio } from 'expo-av';
import { checkMessageAchievements } from '@/utils/achievements';
import AchievementModal from '@/components/AchievementModal';

const ChatRoomFriend = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { sendMessage, currentConversation, setCurrentConversation, setTypingStatus } = useMessaging();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isYuSuggestionsMode, setIsYuSuggestionsMode] = useState(false);
  const [friend, setFriend] = useState<any>(null);
  const params = useLocalSearchParams();
  const { matchId, friendId, showSuggestions } = params;
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // Load friend data and set conversation
  useEffect(() => {
    const loadFriendAndConversation = async () => {
      if (!friendId || !matchId) return;

      try {
        const friendDoc = await getDoc(doc(db, 'users', friendId as string));
        if (friendDoc.exists()) {
          setFriend(friendDoc.data());
        }
        await setCurrentConversation(matchId as string);
        
        // Set Yu suggestions if coming from onboarding
        if (showSuggestions === 'true') {
          setIsYuSuggestionsMode(true);
        }
      } catch (error) {
        console.error('Error loading friend data:', error);
      }
    };

    loadFriendAndConversation();
  }, [friendId, matchId]);

  // Subscribe to messages
  useEffect(() => {
    if (!currentConversation?.id || !user?.uid) return;
  
    const messagesRef = collection(db, `conversations/${currentConversation.id}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: IMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Raw message data:', data);
        const baseMessage: IMessage = {
          _id: doc.id,
          text: data.content || '',
          createdAt: data.timestamp?.toDate() || new Date(),
          user: {
            _id: data.senderId,
            name: data.senderId === user.uid ? 'You' : friend?.name
          },
        };
      
        // Add properties based on message type
        if (data.type === 'image') {
          return {
            ...baseMessage,
            image: data.mediaUrl,
          } as IMessage;
        } else if (data.type === 'voice') {
          return {
            ...baseMessage,
            audio: data.mediaUrl,
          } as IMessage;
        }
      
        return baseMessage;
      });
    
      setMessages(newMessages);
    });
  
    return () => unsubscribe();
  }, [currentConversation?.id, user?.uid]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!currentConversation?.id || !user?.uid) return;
    try {
      const [firstMessage] = newMessages;
      await sendMessage(currentConversation.id, firstMessage.text, 'text');
  
      // Get user reference
      const userRef = doc(db, 'users', user.uid);
      
      // Update messagesSent counter
      await updateDoc(userRef, {
        'stats.messagesSent': increment(1)
      });
  
      // Get updated message count after increment
      const updatedUserDoc = await getDoc(userRef);
      const messageCount = updatedUserDoc.data()?.stats?.messagesSent || 0;
  
      // Check for achievements with updated count
      const achievement = await checkMessageAchievements(user.uid, messageCount);
      
      if (achievement?.unlockedOutfit) {
        setShowAchievementModal(true);
        console.log('New outfit unlocked:', achievement.unlockedOutfit);
      }
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [currentConversation?.id, sendMessage, user?.uid]);


  const handleYuMessage = async (text: string) => {
    if (!currentConversation?.id) return;
    try {
      await sendMessage(currentConversation.id, text, 'ai_generated');
      setIsYuSuggestionsMode(false);
    } catch (error) {
      console.error('Error sending Yu message:', error);
    }
  };

  // Add loading state
  if (!friend) {
    return (
      <SafeLayout style={styles.container}>
        <Text>Loading...</Text>
      </SafeLayout>
    );
  }

  const renderMessageImage = (props: any) => {
    return (
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: props.currentMessage.image }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderMessageAudio = (props: any) => {
    const { currentMessage } = props;
    
    return (
      <View style={styles.audioContainer}>
        <TouchableOpacity 
          style={styles.audioButton}
          onPress={() => playAudio(currentMessage.audio)}
        >
          <Ionicons name="play" size={24} color={Colors.primary} />
          <Text style={styles.audioText}>Voice Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const playAudio = async (uri: string) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    if (isYuSuggestionsMode) {
      return (
        <YuSuggestions
          onSelectContent={handleYuMessage}
          onClose={() => setIsYuSuggestionsMode(false)}
          currentUserId={user?.uid || ''}
          friendId={friendId as string}
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
            {currentConversation ? (
              <ActionMenu conversationId={currentConversation.id} />
            ) : null}
          </View>
        )}
      />
    );
  };
  

  return (
    <SafeLayout style={styles.container}>
<FriendProfileMessageHeader
  id={friendId as string}  // Use friendId from params instead of friend.id
  name={friend.username}   // Use username from Firebase user data
  avatar={friend.avatar}
/>
      
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: user?.uid || '' }}
        renderMessageImage={renderMessageImage}
        renderMessageAudio={renderMessageAudio}
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
      <AchievementModal
      visible={showAchievementModal}
      onClose={() => setShowAchievementModal(false)}
      achievementType="avatar"
      achievementTitle="🎉 New Avatar Unlocked!"
      achievementDescription="You've unlocked a new avatar style! Want to try it on?"
      navigateTo="/avatar-customization"
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
  imageContainer: {
    borderRadius: 13,
    margin: 3,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  audioContainer: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 2,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  audioText: {
    marginLeft: 8,
    color: Colors.primary,
  },
});

export default ChatRoomFriend;
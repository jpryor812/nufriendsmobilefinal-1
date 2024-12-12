import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from "expo-router";
import { useMessaging } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Colors from '@/assets/Colors';

interface MessageListItem {
  conversationId: string;
  userId: string;
  username: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    type: 'text' | 'ai_generated' | 'voice' | 'image';
  };
  unreadCount: number;
  isInitialConversation: boolean;
}

const MessageList: React.FC = () => {
  const { user } = useAuth();
  const { conversations } = useMessaging();
  const [messageItems, setMessageItems] = useState<MessageListItem[]>([]);

  useEffect(() => {
    const loadConversations = async () => {
      console.log('Current user:', user?.uid);
      console.log('Raw conversations from context:', conversations);
  
      if (!conversations || !user) return;
  
      const conversationItems = await Promise.all(
        conversations.map(async (conv) => {
          const otherUserId = Object.keys(conv.participants)
            .find(id => id !== user.uid);
  
          console.log('Found other user ID:', otherUserId);
  
          if (!otherUserId) return null;
  
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          const userData = userDoc.data();
  
          console.log('Found user data:', userData);
  
          if (!userData) return null;

          const isNewConversation = !conv.lastMessage.content || 
          conv.lastMessage.content === "Start your conversation!" ||
          conv.isInitialAiConversation;
  
          // Show conversation even if there's no message history
          return {
            conversationId: conv.id,
            userId: otherUserId,
            username: userData.username,
            lastMessage: {
              content: isNewConversation 
                ? "Click here to start your conversation!" 
                : conv.lastMessage.content,
              timestamp: isNewConversation 
                ? conv.createdAt.toDate() 
                : conv.lastMessage.timestamp.toDate(),
              type: 'text'
            },
            unreadCount: conv.participants[user.uid].unreadCount,
            isInitialConversation: isNewConversation
          };
        })
      );
  
      console.log('Final formatted items:', conversationItems);
  
      // Filter out nulls and sort by timestamp
      const validConversations = conversationItems
        .filter((item): item is MessageListItem => item !== null)
        .sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());
  
      console.log('Valid conversations to display:', validConversations);
      setMessageItems(validConversations);
    };
  
    loadConversations();
  }, [conversations, user]);

  const MessageItem = ({ item }: { item: MessageListItem }) => (
    <Link
      href={{
        pathname: item.isInitialConversation ? "/ChatRoomNewFriend" : "/ChatRoomFriend",
        params: { 
          matchId: item.conversationId,
          friendId: item.userId
        }
      }}
      asChild
    >
      <Pressable style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('@/assets/images/profile_picture.jpg')} 
            style={styles.avatar} 
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.messageContent}>
          <Text style={styles.username}>{item.username}</Text>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadText
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage.content}
          </Text>
        </View>

        <Text style={styles.timestamp}>
          {formatTimestamp(item.lastMessage.timestamp)}
        </Text>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Messages</Text>
    {messageItems.length === 0 ? (
      <Text style={styles.emptyState}>No conversations yet</Text>
    ) : (
      <FlatList
        data={messageItems}
        renderItem={({ item }) => <MessageItem item={item} />}
        keyExtractor={item => item.conversationId}
        contentContainerStyle={styles.listContent}
      />
    )}
    </View>
  );
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffHours = diff / (1000 * 60 * 60);

  if (diffHours < 24) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  return date.toLocaleDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    color: '#42ADE2',
  },
  emptyState: {
    textAlign: 'center',
    color: Colors.gray,
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.gray,
  },
  unreadText: {
    fontWeight: '600',
    color: Colors.lightGray,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 8,
  },
});

export default MessageList;
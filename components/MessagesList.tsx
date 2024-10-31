import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ImageSourcePropType, Pressable } from 'react-native';
import { Link } from "expo-router";

interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  avatar: ImageSourcePropType
}

const parseTimestamp = (timestamp: string): Date => {
  const today = new Date();
  const [time, period] = timestamp.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hour = parseInt(hours);
  if (period.toLowerCase() === 'pm' && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }
  
  today.setHours(hour, parseInt(minutes), 0);
  return today;
};

const messages: Message[] = [
  { id: '1', userId: 'Jpp123', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "6:45 pm", avatar: require('../assets/images/profile_picture.jpg') },
  { id: '2', userId: 'AlexD33', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "5:45 pm", avatar: require('../assets/images/profile_icon.png') },
  { id: '3', userId: 'PChak55', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "4:45 pm", avatar: require('../assets/images/profile-800x800.png') },
  { id: '4', userId: 'OnDeck02', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "3:45 pm", avatar: require('../assets/images/profile2-500x500.png') },
  { id: '5', userId: 'AJones01', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "11:45 am", avatar: require('../assets/images/profile3-500x500.png') },
  { id: '6', userId: 'Hpp123', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "10:45 am", avatar: require('../assets/images/profile_picture.jpg') },
  { id: '7', userId: 'Tpp123', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "9:45 am", avatar: require('../assets/images/profile_picture.jpg') },
  { id: '8', userId: 'Qpp123', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "8:45 am", avatar: require('../assets/images/profile_picture.jpg') },
  { id: '9', userId: 'Wpp123', text: "Yeah I really like dinosaurs. My favorite is a velociraptor but I also really like Ankylosaurus and Triceratops", timestamp: "9:35 am", avatar: require('../assets/images/profile_picture.jpg') },
];

interface MessageItemProps {
  item: Message;
  isRead: boolean;
  onMessageClick: (messageId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, isRead, onMessageClick }) => {
  const handlePress = () => {
    onMessageClick(item.id);
  };

  return (
    <Link 
      href={{
        pathname: "/ChatRoomFriend",
        params: { 
          userId: item.userId,
          username: item.userId,
          avatar: JSON.stringify(item.avatar)
        }
      }} 
      asChild
    >
      <Pressable 
        style={styles.messageContainer}
        onPress={handlePress}
      >
        <View style={styles.avatarContainer}>
          <Image 
            source={item.avatar}
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.username, !isRead && styles.unreadText]}>
            {item.userId}
          </Text>
          <Text 
            style={[styles.messageText, !isRead && styles.unreadText]} 
            numberOfLines={2} 
            ellipsizeMode="tail"
          >
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timestamp, !isRead && styles.unreadText]}>
          {item.timestamp}
        </Text>
      </Pressable>
    </Link>
  );
};

const MessageList: React.FC = () => {
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());

  const handleMessageClick = (messageId: string) => {
    setReadMessages(prev => {
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });
  };

  // Sort messages by read status first, then by timestamp
  const sortedMessages = [...messages].sort((a, b) => {
    const isARead = readMessages.has(a.id);
    const isBRead = readMessages.has(b.id);
    
    // If read status is different, unread messages come first
    if (isARead !== isBRead) {
      return isARead ? 1 : -1;
    }
    
    // If read status is the same, sort by timestamp
    const dateA = parseTimestamp(a.timestamp);
    const dateB = parseTimestamp(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={sortedMessages}
        renderItem={({ item }) => (
          <MessageItem 
            item={item} 
            isRead={readMessages.has(item.id)}
            onMessageClick={handleMessageClick}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  messageContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  messageText: {
    color: '#333',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-start',
  },
  unreadText: {
    color: '#2196F3', // Blue color for unread messages
  },
});

export default MessageList;
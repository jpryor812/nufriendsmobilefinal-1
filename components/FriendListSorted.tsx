import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageSourcePropType } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FriendItemProps {
  initials: string;
  name: string;
  messages: number;
  hasStreak: boolean;
  avatar: ImageSourcePropType;
}

const FriendItem: React.FC<FriendItemProps> = ({ initials, name, messages, hasStreak, avatar }) => (
  <SafeAreaView style={styles.friendItem}>
    <View style={styles.avatarContainer}>
      {hasStreak && <Text style={styles.fireEmoji}>🔥</Text>}
      {avatar ? (
        <Image source={avatar} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.messageCount}>{messages} messages</Text>
    </View>
  </SafeAreaView>
);

interface Friend {
  id: number;
  initials: string;
  name: string;
  messages: number;
  daysAsFriends: number;
  streak: number;
  mutualFriends: number;
  avatar: ImageSourcePropType;
}

const FriendsList: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('messagesMost');
  const [friends, setFriends] = useState<Friend[]>([

      { 
          id: 1, 
          initials: 'JP', 
          name: 'Jpp123', 
          messages: 1238, 
          daysAsFriends: 156, 
          streak: 7, 
          mutualFriends: 12,
          avatar: require('../assets/images/profile_picture.jpg')
      },
      { 
          id: 2, 
          initials: 'AD', 
          name: 'AlexD33', 
          messages: 876, 
          daysAsFriends: 89, 
          streak: 4, 
          mutualFriends: 8,
          avatar: require('../assets/images/profile_icon.png')
      },
      { 
          id: 3, 
          initials: 'PC', 
          name: 'PChak55', 
          messages: 654, 
          daysAsFriends: 134, 
          streak: 9, 
          mutualFriends: 15,
          avatar: require('../assets/images/profile-800x800.png')
      },
      { 
          id: 4, 
          initials: 'OD', 
          name: 'OnDeck02', 
          messages: 445, 
          daysAsFriends: 67, 
          streak: 3, 
          mutualFriends: 6,
          avatar: require('../assets/images/profile2-500x500.png')
      },
      { 
          id: 5, 
          initials: 'AJ', 
          name: 'AJones01', 
          messages: 789, 
          daysAsFriends: 178, 
          streak: 12, 
          mutualFriends: 19,
          avatar: require('../assets/images/profile3-500x500.png')
      },
      { 
          id: 6, 
          initials: 'HP', 
          name: 'Hpp123', 
          messages: 567, 
          daysAsFriends: 45, 
          streak: 5, 
          mutualFriends: 7,
          avatar: require('../assets/images/profile_picture.jpg')
      },
      { 
          id: 7, 
          initials: 'TP', 
          name: 'Tpp123', 
          messages: 234, 
          daysAsFriends: 23, 
          streak: 2, 
          mutualFriends: 4,
          avatar: require('../assets/images/profile_picture.jpg')
      },
      { 
          id: 8, 
          initials: 'QP', 
          name: 'Qpp123', 
          messages: 912, 
          daysAsFriends: 198, 
          streak: 15, 
          mutualFriends: 21,
          avatar: require('../assets/images/profile_picture.jpg')
      },
      { 
          id: 9, 
          initials: 'WP', 
          name: 'Wpp123', 
          messages: 345, 
          daysAsFriends: 56, 
          streak: 6, 
          mutualFriends: 9,
          avatar: require('../assets/images/profile_picture.jpg')
      }
  ]);

  const sortFriends = (option: string) => {
    let sortedFriends = [...friends];
    switch (option) {
      case 'messagesMost':
        sortedFriends.sort((a, b) => b.messages - a.messages);
        break;
      case 'messagesLeast':
        sortedFriends.sort((a, b) => a.messages - b.messages);
        break;
      case 'daysAsFriendsMost':
        sortedFriends.sort((a, b) => b.daysAsFriends - a.daysAsFriends);
        break;
      case 'daysAsFriendsLeast':
        sortedFriends.sort((a, b) => a.daysAsFriends - b.daysAsFriends);
        break;
      case 'longestStreaks':
        sortedFriends.sort((a, b) => b.streak - a.streak);
        break;
      case 'mutualFriendsMost':
        sortedFriends.sort((a, b) => b.mutualFriends - a.mutualFriends);
        break;
      case 'mutualFriendsLeast':
        sortedFriends.sort((a, b) => a.mutualFriends - b.mutualFriends);
        break;
    }
    setFriends(sortedFriends);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <Picker
        selectedValue={sortOption}
        style={styles.picker}
        onValueChange={(itemValue: string) => {
          setSortOption(itemValue);
          sortFriends(itemValue);
        }}
      >
        <Picker.Item label="Messages (Most)" value="messagesMost" />
        <Picker.Item label="Messages (Least)" value="messagesLeast" />
        <Picker.Item label="Days as friends (Most)" value="daysAsFriendsMost" />
        <Picker.Item label="Days as friends (Least)" value="daysAsFriendsLeast" />
        <Picker.Item label="Longest active streaks" value="longestStreaks" />
        <Picker.Item label="Mutual friends (Most)" value="mutualFriendsMost" />
        <Picker.Item label="Mutual friends (Least)" value="mutualFriendsLeast" />
      </Picker>
      <ScrollView style={styles.scrollView}>
        {friends.map((friend) => (
          <FriendItem
            key={friend.id}
            initials={friend.initials}
            name={friend.name}
            messages={friend.messages}
            hasStreak={friend.streak > 0}
            avatar={friend.avatar}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2ff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 200,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  fireEmoji: {
    position: 'absolute',
    top: -5,
    left: -5,
    fontSize: 20,
    zIndex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default FriendsList;
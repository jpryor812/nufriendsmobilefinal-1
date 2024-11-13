import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageSourcePropType } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { friendsData, Friend } from '../constants/FriendsData'; // Update this path'
import SafeLayout from './SafeLayout';

interface FriendItemProps {
  initials: string;
  name: string;
  messages: number;
  hasStreak: boolean;
  avatar: ImageSourcePropType;
}

const FriendItem: React.FC<FriendItemProps> = ({ initials, name, messages, hasStreak, avatar }) => (
  <SafeLayout style={styles.friendItem}>
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
  </SafeLayout>
);

const FriendsList: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('messagesMost');
  const [friends, setFriends] = useState<Friend[]>(friendsData);

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
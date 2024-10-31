import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView } from 'react-native';
import Dropdown from '../components/DropdownMenu';
import FooterNavigation from '../components/FooterNavigation';
import HeaderButtons from '@/components/HeaderButtons';
import { Link } from "expo-router";

interface Friend {
  id: number;
  initials: string;
  name: string;
  messages: number;
  daysAsFriends: number;
  streak: number;
  mutualFriends: number;
  avatar: any; // Use ImageSourcePropType if you're using TypeScript strict mode
}

interface FriendItemProps {
  friend: Friend;
  primaryLabel: string;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend, primaryLabel }) => {
  const getPrimaryData = () => {
    switch (primaryLabel) {
      case 'messages': return friend.messages;
      case 'days as friends': return friend.daysAsFriends;
      case 'day streak': return friend.streak;
      case 'mutual friends': return friend.mutualFriends;
      default: return friend.messages;
    }
  };

  return (
    <SafeAreaView style={styles.friendItem}>
      <View style={styles.avatarContainer}>
        {friend.streak > 0 && <Text style={styles.fireEmoji}>🔥</Text>}
        <Image 
          source={friend.avatar}
          style={styles.avatarImage}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.dataCount}>{getPrimaryData()} {primaryLabel}</Text>
      </View>
    </SafeAreaView>
  );
};

const FriendPage: React.FC = () => {
  const [sortOption, setSortOption] = useState('messagesMost');
  const [primaryDataLabel, setPrimaryDataLabel] = useState('messages');
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
        streak: 0, 
        mutualFriends: 7,
        avatar: require('../assets/images/profile_picture.jpg')
    },
    { 
        id: 7, 
        initials: 'TP', 
        name: 'Tpp123', 
        messages: 234, 
        daysAsFriends: 23, 
        streak: 0, 
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
        streak: 0, 
        mutualFriends: 9,
        avatar: require('../assets/images/profile_picture.jpg')
    }
]);

  const sortOptions = [
    { label: 'Messages (Most)', value: 'messagesMost' },
    { label: 'Messages (Least)', value: 'messagesLeast' },
    { label: 'Days as friends (Most)', value: 'daysAsFriendsMost' },
    { label: 'Days as friends (Least)', value: 'daysAsFriendsLeast' },
    { label: 'Longest active streaks', value: 'longestStreaks' },
    { label: 'Mutual friends (Most)', value: 'mutualFriendsMost' },
    { label: 'Mutual friends (Least)', value: 'mutualFriendsLeast' },
    { label: 'Name (A-Z)', value: 'nameAZ' },       
    { label: 'Name (Z-A)', value: 'nameZA' }
  ];

  const sortFriends = (option: string) => {
    let sortedFriends = [...friends];
    let newPrimaryDataLabel = primaryDataLabel;

    const sortConfig: { [key: string]: () => void } = {
      messagesMost: () => {
        sortedFriends.sort((a, b) => b.messages - a.messages);
        newPrimaryDataLabel = 'messages';
      },
      messagesLeast: () => {
        sortedFriends.sort((a, b) => a.messages - b.messages);
        newPrimaryDataLabel = 'messages';
      },
      daysAsFriendsMost: () => {
        sortedFriends.sort((a, b) => b.daysAsFriends - a.daysAsFriends);
        newPrimaryDataLabel = 'days as friends';
      },
      daysAsFriendsLeast: () => {
        sortedFriends.sort((a, b) => a.daysAsFriends - b.daysAsFriends);
        newPrimaryDataLabel = 'days as friends';
      },
      longestStreaks: () => {
        sortedFriends.sort((a, b) => b.streak - a.streak);
        newPrimaryDataLabel = 'day streak';
      },
      mutualFriendsMost: () => {
        sortedFriends.sort((a, b) => b.mutualFriends - a.mutualFriends);
        newPrimaryDataLabel = 'mutual friends';
      },
      mutualFriendsLeast: () => {
        sortedFriends.sort((a, b) => a.mutualFriends - b.mutualFriends);
        newPrimaryDataLabel = 'mutual friends';
      },
      nameAZ: () => {
        sortedFriends.sort((a, b) => a.name.localeCompare(b.name));
      },
      nameZA: () => {
        sortedFriends.sort((a, b) => b.name.localeCompare(a.name));
      }
    };

    sortConfig[option]?.();
    setFriends(sortedFriends);
    setPrimaryDataLabel(newPrimaryDataLabel);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderButtons 
        onPressFindFriends={() => console.log('Find Friends pressed')}
        onPressUpgrade={() => console.log('Upgrade pressed')}
      />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}>Friends</Text>
        <Image source={require('../assets/images/hand_progress_bar.png')} style={styles.titleImage} />
        </View>
        <Dropdown
          options={sortOptions}
          selectedValue={sortOption}
          onSelect={(value) => {
            setSortOption(value);
            sortFriends(value);
          }}
        />
        <ScrollView style={styles.scrollView}>
          {friends.map((friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              primaryLabel={primaryDataLabel}
            />
          ))}
        </ScrollView>
      </View>
      <FooterNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FCFE',
      },
      contentContainer: {
        flex: 1,
      },
        titleContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        titleImage: {
            width: 30,
            height: 30,
            marginLeft: 10,
        },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
        textAlign: 'center',
      },
      scrollView: {
        marginTop: 10,
        flex: 1,
        padding: 6,
      },
      friendItem: {
        flexDirection: 'row',
        alignItems: 'center',  // Changed from alignContent
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: '92%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        marginTop: 8,
        marginBottom: 8,
        // Replace border with shadow
        borderWidth: 1, 
        borderColor: '#909090',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,  // for Android
    },
      avatarContainer: {
        position: 'relative',
        marginRight: 10,
        marginLeft: 6,
        padding: 2,
        backgroundColor: '#fafafa',
        marginTop: 2,
      },
      fireEmoji: {
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: 16,
        zIndex: 5,
      },
      avatarImage: {
        width: 46,
        height: 46,
        borderRadius: 25,
      },
      infoContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      dataCount: {
        fontSize: 14,
        color: '#606060',
      },
    });
    
export default FriendPage;
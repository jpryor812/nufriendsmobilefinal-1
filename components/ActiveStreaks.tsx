import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import Card from './Card';

type Friend = {
  id: number;
  initials: string;
  name: string;
  messages: number;
  daysAsFriends: number;
  streak: number;
  mutualFriends: number;
  avatar: any;
};

const friendsData: Friend[] = [
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
];

type StreakItemProps = {
  streak: number;
  name: string;
  avatar: any;
  onViewRelationship: () => void;
};

const StreakItem: React.FC<StreakItemProps> = ({ streak, name, avatar, onViewRelationship }) => (
  <View style={styles.streakItem}>
    <View style={styles.leftContainer}>
      <Text style={styles.fireEmoji}>🔥</Text>
      <Text style={styles.streakNumber}>{streak} days</Text>
    </View>
    <View style={styles.rightContainer}>
      <View style={styles.avatarWrapper}>
        <Image source={avatar} style={styles.avatar} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={onViewRelationship}
      >
        <Text style={styles.buttonText}>See More</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ActiveStreaks: React.FC = () => {
  const activeStreaks = friendsData
    .filter(friend => friend.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .map(friend => ({
      streak: friend.streak,
      name: friend.name,
      avatar: friend.avatar
    }));

    const handleViewRelationship = (name: string) => {
      // Handle button press - you can add navigation or other logic here
      console.log(`Viewing relationship with ${name}`);
    };

    return (
      <Card style={styles.container}>
        <Text style={styles.title}>Active Streaks</Text>
        {activeStreaks.map((item, index) => (
          <StreakItem 
            key={index} 
            {...item} 
            onViewRelationship={() => handleViewRelationship(item.name)}
          />
        ))}
      </Card>
    );
  };

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  streakItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 2,
    height: 48, 
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100, // Ensure consistent width for the left side
  },
  fireEmoji: {
    fontSize: 20,
    marginRight: 6,
    width: 24, // Fixed width for consistent spacing
    textAlign: 'center',
  },
  streakNumber: {
    fontSize: 16,
    minWidth: 70,
    fontWeight: 'bold', 
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Take up remaining space
    justifyContent: 'flex-end', // Align contents to the right
  },
  avatarWrapper: {
    width: 32, // Fixed width container for avatar
    height: 32, // Fixed height container for avatar
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  name: {
    fontSize: 16,
    minWidth: 80, // Fixed width for names
    textAlign: 'left',
    fontWeight: 'bold', 

  },
  button: {
    backgroundColor: '#439DF5', // iOS blue color
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 10,
    width: 50,
    marginLeft: 10, // Pushes button to the right
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ActiveStreaks;
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from './Card';
import { Link } from "expo-router";
import { Friend, friendsData } from '../constants/FriendsData'; // adjust the import path based on your file location

type StreakItemProps = {
  streak: number;
  name: string;
  avatar: any;
  userId: number;
};

const StreakItem: React.FC<StreakItemProps> = ({ streak, name, avatar, userId }) => (
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
      <Link 
        href={{
          pathname: "/RelationshipTracker",
          params: { id: userId, name: name }
        }}
        asChild
      >
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>See More</Text>
        </TouchableOpacity>
      </Link>
    </View>
  </View>
);

const ActiveStreaks: React.FC = () => {
  const activeStreaks = friendsData
    .filter(friend => friend.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .map(friend => ({
      id: friend.id,
      streak: friend.streak,
      name: friend.name,
      avatar: friend.avatar
    }));

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Active Streaks</Text>
      {activeStreaks.map((item, index) => (
        <StreakItem 
          key={index} 
          streak={item.streak}
          name={item.name}
          avatar={item.avatar}
          userId={item.id}
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
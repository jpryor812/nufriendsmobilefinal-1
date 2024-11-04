import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface FriendProfileProps {
  friend: {
    id: number;
    initials: string;
    name: string;
    messages: number;
    daysAsFriends: number;
    streak: number;
    mutualFriends: number;
    avatar: any;
    city: string;
    state: string;
    country: string;
    age: number;
    gender: string; // Add this if you're still using avatars
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  return (
    <View style={styles.container}>
      {friend.avatar && (
        <Image 
          source={friend.avatar} 
          style={styles.avatar}
          resizeMode="cover"
        />
      )}
      <Text style={styles.name}>{friend.name}</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Gender: {friend.gender}</Text>
        <Text style={styles.detailText}>Location: {friend.city}, {friend.state}</Text>
        <Text style={styles.detailText}>Country: {friend.country}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#42ade2',
  },
  detailsContainer: {
    width: '100%',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
});

export default FoundFriendProfile;
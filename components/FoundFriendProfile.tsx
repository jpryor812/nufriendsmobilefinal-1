import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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
    gender: string;
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.friendContainer}>
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
              
      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => router.push({
          pathname: '/ChatRoomFriend',
          params: {
            id: friend.id.toString()
          }
        })}
      >
        <Image 
          source={require('../assets/images/incoming_envelope.png')}
          style={{ width: 42, height: 24 }} 
        />
        <Text style={styles.messageButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    gap: 20, // Adds space between the friend container and button
  },
  friendContainer: {
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
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    width: 210,
  },
  messageButtonText: {
    color: '#3498db',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoundFriendProfile;
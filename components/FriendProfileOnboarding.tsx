import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FriendProfileOnboardingProps {
  friend: {
    username: string;
    demographics: {
      city: string;
      state: string;
      gender: string;
      age: number;
    };
    profileSummaries: {
      goals: string;
      travel: string;
      entertainment: string;
      location: string;
      hobbies: string;
      music: string;
    };
  };
}

const FriendProfileOnboarding: React.FC<FriendProfileOnboardingProps> = ({ friend }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={require('@/assets/images/profile_picture.jpg')}
          style={styles.avatar}
        />
        <Text style={styles.username}>{friend.username}</Text>
        
        <View style={styles.basicInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {friend.demographics.city}, {friend.demographics.state}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{friend.demographics.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{friend.demographics.age} years-old</Text>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About {friend.username}</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>Goals:</Text>
            <Text style={styles.value}>{friend.profileSummaries.goals}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Best Trip:</Text>
            <Text style={styles.value}>{friend.profileSummaries.travel}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Favorite Content:</Text>
            <Text style={styles.value}>{friend.profileSummaries.entertainment}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Born In:</Text>
            <Text style={styles.value}>{friend.profileSummaries.location}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Hobbies:</Text>
            <Text style={styles.value}>{friend.profileSummaries.hobbies}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Favorite Music:</Text>
            <Text style={styles.value}>{friend.profileSummaries.music}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#42ade2',
    textAlign: 'center',
    marginBottom: 16,
  },
  basicInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  aboutSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#42ade2',
    marginBottom: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FriendProfileOnboarding;
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { httpsCallable } from 'firebase/functions';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth, functions as baseFunctions } from '@/config/firebase';
import { Ionicons } from '@expo/vector-icons';

interface GenderIcon {
  source: any;
  dimensions: {
    width: number;
    height: number;
  };
}

interface ProfileSummaries {
  entertainment: string;
  goals: string;
  hobbies: string;
  isVisible: boolean;
  location: string;
  music: string;
  travel: string;
}

interface FriendProfileProps {
  friend: {
    uid: string;  // Changed from id
    username: string;
    demographics: {
      gender: string;
      state: string;
      city: string;
      age: number;
      birthDate: number;
    };
    profileSummaries?: ProfileSummaries;
    matchDetails?: {
      compatibilityScore: number;
    };
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const router = useRouter();
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);

  const displayNames = {
    'location': 'Born In',
    'hobbies': 'Hobbies',
    'music': 'Favorite Music',
    'entertainment': 'Favorite Content',
    'travel': 'Best Trip',
    'goals': 'Goals'
  };

  const getGenderIcon = (gender: string): GenderIcon => {
    switch (gender.toLowerCase()) {
        case 'male':
            return {
                source: require('../assets/images/male_icon.png'),
                dimensions: { width: 18, height: 18 }
            };
        case 'female':
            return {
                source: require('../assets/images/female_icon.png'),
                dimensions: { width: 12, height: 18 }
            };
        case 'non-binary':
            return {
                source: require('../assets/images/non-binary_icon.png'),
                dimensions: { width: 12, height: 18 }
            };
        default:
            return {
                source: require('../assets/images/face_icon.png'),
                dimensions: { width: 18, height: 18 }
            };
    }
  };

    const handleOpenChat = async () => {
      try {
        setIsGeneratingChat(true);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No authenticated user');
        }
  
        // Query matches collection to find the match document
        const matchesRef = collection(db, 'matches');
        const q = query(
          matchesRef,
          where('users', 'array-contains', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const matchDoc = querySnapshot.docs.find(
          doc => doc.data().users.includes(friend.uid)
        );
        
        if (!matchDoc) {
          throw new Error('Match not found');
        }
  
        // Generate initial conversation
        const generateConversation = httpsCallable(baseFunctions, 'generateInitialConversation');
        await generateConversation({ matchId: matchDoc.id });
  
        // Navigate to chat room
        router.push({
          pathname: '/ChatRoomFriend',
          params: { 
            matchId: matchDoc.id,
            friendId: friend.uid
          }
        });
      } catch (error) {
        console.error('Error opening chat:', error);
        Alert.alert(
          'Error',
          'Unable to open chat at this time. Please try again later.'
        );
      } finally {
        setIsGeneratingChat(false);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.friendContainer}>
        <Image 
          source={require('../assets/images/profile_picture.jpg')} 
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.name}>{friend.username}</Text>

        {/* Basic Details */}
        <View style={styles.details}>
          <View style={styles.detailContainer}>
            <Image 
              source={require('../assets/images/Home_icon.png')}
              style={{ width: 20, height: 20 }} 
            />
            <Text style={styles.detailText}>
              {friend.demographics.city}, {friend.demographics.state}
            </Text>
          </View>
          <View style={styles.detailContainer}>
            {(() => {
              const iconInfo = getGenderIcon(friend.demographics.gender);
              return (
                <Image 
                  source={iconInfo.source}
                  style={iconInfo.dimensions}
                />
              );
            })()}
            <Text style={styles.detailText}>{friend.demographics.gender}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Image 
              source={require('../assets/images/ph_cake.png')}
              style={{ width: 18, height: 18 }} 
            />
            <Text style={styles.detailText}>{friend.demographics.age} years-old</Text>
          </View>
        </View>
        {friend.profileSummaries && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>About {friend.username}</Text>
            {Object.entries(friend.profileSummaries)
              .filter(([key]) => key !== 'isVisible')
              .map(([key, value]) => (
                <View key={key} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {displayNames[key as keyof typeof displayNames]}:
                  </Text>
                  <Text style={styles.summaryValue}>{value}</Text>
                </View>
              ))}
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.chatButton,
            isGeneratingChat && styles.chatButtonDisabled
          ]}
          onPress={handleOpenChat}
          disabled={isGeneratingChat}
        >
          <View style={styles.buttonContent}>
            <Ionicons 
              name="chatbubble-outline" 
              size={24} 
              color="white" 
            />
            <Text style={styles.chatButtonText}>
              {isGeneratingChat ? "Opening Chat..." : "Start Chatting!"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    gap: 16,
  },
  friendContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '92%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#42ade2',
  },
  details: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 4,
  },
  detailText: {
    color: '#000',
    marginHorizontal: 5,
  },
  summaryContainer: {
    width: '100%',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#42ade2',
    marginBottom: 12,
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#42ade2',
    padding: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    width: 300,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#a9a9a9',
    width: 220,
  },
  messageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  messageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#7d7d7d',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchDetails: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    marginVertical: 10,
  },
  compatibilityScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#42ade2',
    textAlign: 'center',
    marginBottom: 8,
  },
  matchReason: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  commonInterests: {
    marginTop: 8,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  interestItem: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
    marginVertical: 2,
  },
  interestsPreview: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
  interestsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  chatButton: {
    backgroundColor: '#42ade2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%', // Adjust this to match your design
  },
  chatButtonDisabled: {
    backgroundColor: '#a0d8f4',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default FoundFriendProfile;
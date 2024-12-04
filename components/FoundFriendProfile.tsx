import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface GenderIcon {
  source: any;
  dimensions: {
    width: number;
    height: number;
  };
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
    matchDetails?: {
      compatibilityScore: number;
      
    };
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const router = useRouter();

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
                dimensions: { width: 14, height: 20 }
            };
        case 'non-binary':
            return {
                source: require('../assets/images/non-binary_icon.png'),
                dimensions: { width: 18, height: 18 }
            };
        default:
            return {
                source: require('../assets/images/face_icon.png'),
                dimensions: { width: 18, height: 18 }
            };
    }
};

  // Helper function to format compatibility score
  const formatScore = (score: number): string => {
    return `${Math.round(score)}%`;
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
              style={{ width: 22, height: 22 }} 
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
      </View>
              
      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => router.push({
          pathname: '/ChatRoomNewFriend',
          params: {
            id: friend.uid  // Changed from id to uid
          }
        })}
      >
        <View style={styles.messageButtonContent}>
        <Image 
          source={require('../assets/images/Yu_excited_no_speech.png')}
          style={{ width: 34, height: 34, marginLeft: 10 }} 
        />
        <Text style={styles.messageButtonText}>Start Chatting!</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  friendContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '88%',
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
    paddingVertical: 5,
  },
  detailText: {
    color: '#000',
    marginHorizontal: 5,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#42ade2',
    padding: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    width: 280,
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
    marginLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
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
});

export default FoundFriendProfile;
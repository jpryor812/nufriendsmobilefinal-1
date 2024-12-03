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
    user_id: string;
    username: string;
    demographics: {
      gender: string;
      state: string;
      city: string;
      age: number;
      birth_date: number;
    };
    match_details?: {
      compatibility_score: number;
      waiting_score: number;
      final_score: number;
      match_reason?: string;
      common_interests?: string[];
    };
    onboarding_responses: {
      aspirations: string;
      entertainment: string;
      hobbies: string;
      location: string;
      music: string;
      travel: string;
    };
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const router = useRouter();

  const getGenderIcon = (gender: string): GenderIcon => {
    // ... existing gender icon logic ...
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
        
        {/* Match Details Section */}
        {friend.match_details && (
          <View style={styles.matchDetails}>
            <Text style={styles.compatibilityScore}>
              {formatScore(friend.match_details.compatibility_score)} Match!
            </Text>
            {friend.match_details.match_reason && (
              <Text style={styles.matchReason}>
                {friend.match_details.match_reason}
              </Text>
            )}
            {friend.match_details.common_interests && (
              <View style={styles.commonInterests}>
                <Text style={styles.interestsTitle}>Common Interests:</Text>
                {friend.match_details.common_interests.map((interest, index) => (
                  <Text key={index} style={styles.interestItem}>• {interest}</Text>
                ))}
              </View>
            )}
          </View>
        )}

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

        {/* Interests Preview */}
        <View style={styles.interestsPreview}>
          <Text style={styles.interestsHeader}>A bit about {friend.username}:</Text>
          <Text style={styles.interestText}>
            {friend.onboarding_responses.hobbies}
          </Text>
        </View>
      </View>
              
      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => router.push({
          pathname: '/ChatRoomNewFriend',
          params: {
            id: friend.user_id  // Changed from uid
          }
        })}
      >
        <Image 
          source={require('../assets/images/Yu_excited_no_speech.png')}
          style={{ width: 36, height: 36 }} 
        />
        <Text style={styles.messageButtonText}>Start Chatting!</Text>
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
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
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
    color: '#3498db',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
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
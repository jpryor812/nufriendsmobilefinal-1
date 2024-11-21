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
    id: string;
    username: string;
    demographics: {
      gender: string;
      state: string;
      city: string;
      age: number;
    };
  };
}

const FoundFriendProfile: React.FC<FriendProfileProps> = ({ friend }) => {
  const router = useRouter();

  const getGenderIcon = (gender: string): GenderIcon => {
    switch (gender.toLowerCase()) {
      case 'female':
        return {
          source: require('../assets/images/female_icon.png'),
          dimensions: {
            width: 12,
            height: 18
          }
        };
      case 'male':
        return {
          source: require('../assets/images/male_icon.png'),
          dimensions: {
            width: 14,
            height: 14
          }
        };
      case 'non-binary':
        return {
          source: require('../assets/images/non-binary_icon.png'),
          dimensions: {
            width: 12,
            height: 22
          }
        };
      case 'other':
        return {
          source: require('../assets/images/face_icon.png'),
          dimensions: {
            width: 18,
            height: 20
          }
        };
      case 'prefer not to say':
        return {
          source: require('../assets/images/minus_sign.png'),
          dimensions: {
            width: 8,
            height: 2
          }
        };
      default:
        return {
          source: require('../assets/images/face_icon.png'),
          dimensions: {
            width: 18,
            height: 20
          }
        };
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
            id: friend.id
          }
        })}
      >
        <Image 
          source={require('../assets/images/Yu_excited_no_speech.png')}
          style={{ width: 36, height: 36 }} 
        />
        <Text style={styles.messageButtonText}>View the Conversation!!</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => router.push('/HomePage')}
      >
        <Image 
          source={require('../assets/images/house_emoji.png')}
          style={{ width: 32, height: 32 }} 
        />
        <Text style={styles.homeButtonText}>Go Back To Home</Text>
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
});

export default FoundFriendProfile;
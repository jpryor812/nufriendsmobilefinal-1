import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { friendsData } from '../constants/FriendsData';
import FriendBadgeSection from '../components/FriendBadgeSection';
import ScrollSafeLayout from '@/components/ScrollSafeLayout';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import SafeLayout from '@/components/SafeLayout';

const RelationshipTracker = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const friend = friendsData.find(f => f.id === Number(params.id));
  if (!friend) return null;

  // Helper function to calculate percentile rank
  const calculatePercentile = (value: number, category: 'messages' | 'streak' | 'daysAsFriends' | 'mutualFriends') => {
    const sortedValues = [...friendsData]
      .map(f => f[category])
      .sort((a, b) => b - a); // Sort in descending order
    
    const position = sortedValues.indexOf(value);
    const percentile = (position / sortedValues.length) * 100;
    
    if (percentile <= 5) return 'top5';
    if (percentile <= 10) return 'top10';
    if (percentile <= 25) return 'top25';
    return null;
  };

  // Get percentile ranks for each category
  const messagePercentile = calculatePercentile(friend.messages, 'messages');
  const streakPercentile = calculatePercentile(friend.streak, 'streak');
  const daysasfriendsPercentile = calculatePercentile(friend.daysAsFriends, 'daysAsFriends');
  const mutualFriendsPercentile = calculatePercentile(friend.mutualFriends, 'mutualFriends');

  interface GenderIcon {
    source: any;
    dimensions: {
      width: number;
      height: number;
    };
  }

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
    }
  };

  // Helper component for trophy display
  const TrophyIndicator = ({ percentile }: { percentile: string | null }) => {
    if (!percentile) return null;

    const getPercentileText = () => {
      switch (percentile) {
        case 'top5': return 'Top 5%!';
        case 'top10': return 'Top 10%!';
        case 'top25': return 'Top 25%!';
        default: return '';
      }
    };

    return (
      <View style={styles.trophyContainer}>
        <Text style={[
          styles.trophyText,
          percentile === 'top5' && styles.trophyTextGold,
          percentile === 'top10' && styles.trophyTextSilver,
          percentile === 'top25' && styles.trophyTextBronze,
        ]}>
          {getPercentileText()}
        </Text>
        <Image 
          source={require('../assets/images/trophy_emoji_progress_bar.png')}
          style={[
            styles.trophy_icon,
            percentile === 'top5' && styles.trophyGold,
            percentile === 'top10' && styles.trophySilver,
            percentile === 'top25' && styles.trophyBronze,
          ]}
          resizeMode='contain'
        />
      </View>
    );
  };

  return (
    <SafeLayout style={styles.safeArea}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.container}>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Image 
              source={friend.avatar}
              style={styles.avatarImage}
            />
            <Text style={styles.username}>{friend.name}</Text>
          </View>

          {/* Send Message Button */}
          <TouchableOpacity 
    style={styles.messageButton}
    onPress={() => router.push({
        pathname: '/ChatRoomFriend',
        params: {
            userId: friend.id,
            username: friend.name,
            avatar: JSON.stringify(friend.avatar) // Need to stringify since we're parsing it back in ChatRoomFriend
        }
    })}
>
    <Image 
        source={require('../assets/images/incoming_envelope.png')}
        style={{ width: 36, height: 18 }} 
    />
    <Text style={styles.messageButtonText}>Send Message</Text>
</TouchableOpacity>

          <View style={styles.details}>
    <View style={styles.detailContainer}>
        <Image source={require('../assets/images/Home_icon.png')}
            style={{ width: 22, height: 22 }} />
        <Text style={styles.detailText}>{friend.city}</Text>
    </View>
    <View style={styles.detailContainer}>
    {(() => {
        const iconInfo = getGenderIcon(friend.gender);
        return (
            <Image 
                source={iconInfo.source}
                style={iconInfo.dimensions}
            />
        );
    })()}
    <Text style={styles.detailText}>{friend.gender}</Text>
</View>
    <View style={styles.detailContainer}>
        <Image source={require('../assets/images/ph_cake.png')}
            style={{ width: 18, height: 18 }} />
        <Text style={styles.detailText}>{friend.age} years-old</Text>
    </View>
</View>
                {/* Will askusers directly for their city, gender, and age for this data and for filtering */}
        {/* Friends Since */}
        <View style={styles.statsSection}>
        <Text style={styles.statsHeader}>Stats</Text>
        <View style={styles.friendsSince}>
        <Image source={require('../assets/images/champagne.png')}
                style={{ width: 20, height: 20 }} />
          <Text style={styles.friendsSinceText}>Friends since 11/23/2024</Text>
          {/* will have this input created for the day they matched when app is actually live */}
          <Image source={require('../assets/images/champagne.png')}
                style={{ width: 20, height: 20 }} />
        </View>

        {/* Messages Stat */}
        <TrophyIndicator percentile={messagePercentile} />
        <View style={styles.statCard}>
          <Image 
            source={require('../assets/images/mailbox_emoji (1).png')}
            style={{ width: 28, height: 28 }} 
          />
          <Text style={styles.statText}>Messages Sent: {friend.messages}</Text>
        </View>

        {/* Streak Stat */}
        <TrophyIndicator percentile={streakPercentile} />
        <View style={styles.statCard}>
          <Image 
            source={require('../assets/images/fire emoji (1).png')}
            style={{ width: 28, height: 28 }} 
          />
          <Text style={styles.statText}>Longest Streak: {friend.streak} Days</Text>
        </View>

                {/* Streak Stat */}
                <TrophyIndicator percentile={daysasfriendsPercentile} />
        <View style={styles.statCard}>
          <Image 
            source={require('../assets/images/calendar_emoji.png')}
            style={{ width: 28, height: 28 }} 
          />
          <Text style={styles.statText}>Days as Friends: {friend.daysAsFriends} Days</Text>
        </View>

        {/* Mutual Friends Stat */}
        <TrophyIndicator percentile={mutualFriendsPercentile} />
        <View style={styles.statCard}>
          <Image 
            source={require('../assets/images/hand_progress_bar.png')}
            style={{ width: 28, height: 28 }} 
          />
          <Text style={styles.statText}>Mutual Friends: {friend.mutualFriends}</Text>
        </View>
      </View>

      <Text style={styles.badgesHeader}>Badges ^</Text>
      <ScrollView>
      <FriendBadgeSection />
      </ScrollView>
              </View>
    </View>
    </SafeLayout>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'flex-start',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -10,
  },
  pcText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#3498db',
    width: 190,
  },
  messageButtonText: {
    color: '#3498db',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
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
  friendsSince: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    marginTop:-4,
    justifyContent: 'center',
  },
  friendsSinceText: {
    color: '#3498db',
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsSection: {
    marginTop: 16,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 6,
    paddingLeft: 12,
    borderRadius: 16,
    marginBottom: 22,
    width: '78%',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  statText: {
    marginLeft: 14,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db'
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: -4,
    zIndex: 1,
    marginTop: -16,
  },
  trophy_icon: {
    width: 22,
    height: 22,
    marginLeft: 4,
  },
  trophyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trophyTextGold: {
    color: '#FFD700',
  },
  trophyTextSilver: {
    color: '#C0C0C0',
  },
  trophyTextBronze: {
    color: '#CD7F32',
  },
  trophyGold: {
    tintColor: '#FFD700',
  },
  trophySilver: {
    tintColor: '#C0C0C0',
  },
  trophyBronze: {
    tintColor: '#CD7F32',
  },
  badgesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RelationshipTracker;
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { friendsData } from '../constants/FriendsData';

const RelationshipTracker = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Find the friend using the ID from params
  const friend = friendsData.find(f => f.id === Number(params.id));

  if (!friend) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Friends</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/Settings.png')}
            style={{ width: 24, height: 24 }}
          />
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Image 
              source={friend.avatar}
              style={styles.avatarImage}
            />
            <Text style={styles.username}>{friend.name}</Text>
          </View>

          {/* Send Message Button */}
          <TouchableOpacity style={styles.messageButton}>
            <Image source={require('../assets/images/incoming_envelope.png')}
              style={{ width: 36, height: 18 }} />
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>

          <View style={styles.details}>
            <View style={styles.detailContainer}>
          <Image source={require('../assets/images/Home_icon.png')}
                style={{ width: 22, height: 22 }} />
          <Text style={styles.detailText}>Pittsburgh, PA</Text>
        </View>
        <View style={styles.detailContainer}>
          <Image source={require('../assets/images/male_icon.png')}
                style={{ width: 16, height: 16 }} />
          <Text style={styles.detailText}>Male</Text>
        </View>
        <View style={styles.detailContainer}>
        <Image source={require('../assets/images/ph_cake.png')}
                style={{ width: 18, height: 18 }} />
          <Text style={styles.detailText}>24 years-old</Text>
        </View>
        </View>
                {/* Will ask users directly for their city, gender, and age for this data and for filtering */}
        {/* Friends Since */}
        <View style={styles.friendsSince}>
        <Image source={require('../assets/images/champagne.png')}
                style={{ width: 20, height: 20 }} />
          <Text style={styles.friendsSinceText}>Friends since 11/23/2024 (37 days)</Text>
        </View>


          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.statsHeader}>Stats</Text>

            <Text style={styles.trophyText}>Top 5%!</Text>
            <View style={styles.statCard}>
              <Image source={require('../assets/images/mailbox_emoji (1).png')}
                style={{ width: 28, height: 28 }} />
              <Text style={styles.statText}>Messages Sent: {friend.messages}</Text>
              <View style={styles.trophyContainer}>
              </View>
            </View>

            <Text style={styles.trophyText}>Top 20%!</Text>
            <View style={styles.statCard}>
              <Image source={require('../assets/images/fire emoji (1).png')}
                style={{ width: 28, height: 28 }} />
              <Text style={styles.statText}>Longest Streak: {friend.streak} Days</Text>
              <View style={styles.trophyContainer}>
              </View>
            </View>

            <View style={styles.statCard}>
              <Image source={require('../assets/images/hand_progress_bar.png')}
                style={{ width: 28, height: 28 }} />
              <Text style={styles.statText}>Mutual Friends: {friend.mutualFriends}</Text>
            </View>
          </View>

          <Text style={styles.badgesHeader}>Badges</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  backButton: {
    padding: 10,
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
    marginTop: -4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    padding: 10,
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
    },
  detailText: {
    color: '#000',
    marginHorizontal: 5,
  },
  friendsSince: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendsSinceText: {
    color: '#000',
    marginLeft: 5,
  },
  statsSection: {
    marginTop: 20,
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
    marginBottom: 12,
    width: '80%',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  statText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C64F'
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  trophyText: {
    color: '#666',
    marginLeft: 5,
    fontSize: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
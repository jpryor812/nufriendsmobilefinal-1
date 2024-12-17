import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/assets/Colors';
import SafeLayout from '@/components/SafeLayout';
import FriendProfileMessageHeader from '@/components/FriendProfileMessageHeader';
import SmallYuOnboarding from '@/components/SmallYuOnboarding';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import FriendProfileOnboarding from '@/components/FriendProfileOnboarding';

const ChatRoomNewFriend = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { matchId, friendId } = params;

  // Add loading state and friend data fetching if needed
  // This would replace your static friendsData lookup
  const [friend, setFriend] = useState<any>(null);

  useEffect(() => {
    const loadFriendData = async () => {
      if (friendId) {
        const friendDoc = await getDoc(doc(db, 'users', friendId as string));
        if (friendDoc.exists()) {
          setFriend(friendDoc.data());
        }
      }
    };

    loadFriendData();
  }, [friendId]);

  if (!friend) return null;

  return (
    <SafeLayout style={styles.container}>
      <FriendProfileMessageHeader
        id={friendId as string}
        name={friend.username}
        avatar={friend.avatar}
      />
      
      <View style={styles.contentContainer}>
        <SmallYuOnboarding 
          text="Hey There! Feel free to start the conversation yourself, or with some tips from me! Also, here is a reminder of what your new friend is like."
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.tipButton]}
            onPress={() => {
              router.push({
                pathname: '/ChatRoomFriend',
                params: { 
                  matchId,
                  friendId,
                  showSuggestions: 'true'
                }
              });
            }}
          >
            <Text style={styles.buttonText}>I could use some tips!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.directButton]}
            onPress={() => {
              router.push({
                pathname: '/ChatRoomFriend',
                params: { 
                  matchId,
                  friendId,
                  showSuggestions: 'false'
                }
              });
            }}
          >
            <Text style={styles.buttonText}>I'm ok for now.</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FriendProfileOnboarding friend={friend} />
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  contentContainer: {
  },
  buttonContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 60,
    marginHorizontal: 48,
  },
  button: {
    flex: 1,
    padding: 10,    
    borderRadius: 25,
    marginBottom: 16,
    alignItems: 'center',
  },
  tipButton: {
    backgroundColor: '#57C7FF',
  },
  directButton: {
    backgroundColor: '#57C7FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ChatRoomNewFriend;
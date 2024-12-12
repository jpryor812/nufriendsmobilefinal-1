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
          text="Hey There! Feel free to start the conversation off however you'd like. If you're not sure what to say, you can tap me in the bottom left corner there at any time for some suggested conversation starters. As a reminder, here is some information about your friend. You can also just tap on their profile to view that information as well. Feel free to select where you want some help, or to send the message on your own."
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
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  tipButton: {
    backgroundColor: '#42ade2',
  },
  directButton: {
    backgroundColor: '#57C7FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChatRoomNewFriend;
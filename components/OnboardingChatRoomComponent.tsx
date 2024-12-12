import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import SmallYuOnboarding from './SmallYuOnboarding';
import FriendProfileOnboarding from './FriendProfileOnboarding';

interface OnboardingChatRoomProps {
  matchId: string;
  friendId: string;
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

const OnboardingChatRoom: React.FC<OnboardingChatRoomProps> = ({ 
  matchId,
  friendId,
  friend
}) => {
  const router = useRouter();

  const handleDirectChat = () => {
    router.push({
      pathname: '/ChatRoomFriend',
      params: { 
        matchId,
        friendId,
        showSuggestions: 'false'
      }
    });
  };

  const handleNeedHelp = () => {
    router.push({
      pathname: '/ChatRoomFriend',
      params: { 
        matchId,
        friendId,
        showSuggestions: 'true'
      }
    });
  };

  return (
    <View style={styles.container}>
      <SmallYuOnboarding 
        text="Hey There! Feel free to start the conversation off however you'd like. If you're not sure what to say, you can tap me in the bottom left corner there at any time for some suggested conversation starters. As a reminder, here is some information about your friend. You can also just tap on their profile to view that information as well. Feel free to select where you want some help, or to send the message on your own."
      />
      
      <FriendProfileOnboarding friend={friend} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.tipButton]}
          onPress={handleNeedHelp}
        >
          <Text style={styles.buttonText}>I could use some tips</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.directButton]}
          onPress={handleDirectChat}
        >
          <Text style={styles.buttonText}>I'm ok for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
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

export default OnboardingChatRoom;
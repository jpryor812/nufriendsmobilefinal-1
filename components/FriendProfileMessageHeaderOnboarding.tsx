import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Colors from '@/assets/Colors';

interface FriendProfileMessageHeaderOnboardingProps {
  imageSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
}

const FriendProfileMessageHeaderOnboarding: React.FC<FriendProfileMessageHeaderOnboardingProps> = ({ imageSource, name, onPress }) => {
  return (
    <View style={styles.friend_profile_container}>
        <View style={styles.friendContainer}>
          <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
          <Text style={styles.profileNameText}>{name}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friend_profile_container: {
    flexDirection: 'row',
    alignItems: 'center', // Center children vertically
    borderBottomWidth: 1,
    borderBottomColor: '#EBF7FE',
    marginBottom: 4,
  },
  friendContainer: {
    flex: 1, // Take up remaining space
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 3,
  },
  profileNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 3,
  },
});

export default FriendProfileMessageHeaderOnboarding;
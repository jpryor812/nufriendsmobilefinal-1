import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface FriendProfileProps {
  imageSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ imageSource, name, onPress }) => {
  return onPress ? (
    <TouchableOpacity onPress={onPress} style={styles.friend_profile_container}>
      <View style={styles.friendContainer}>
        <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
        <Text style={styles.profileNameText}>{name}</Text>
      </View>
    </TouchableOpacity>
  ) : (
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  friendContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: '10%',
  },
  profileNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default FriendProfile;
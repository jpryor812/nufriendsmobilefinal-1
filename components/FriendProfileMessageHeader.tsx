import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

interface FriendProfileMessageHeaderProps {
  imageSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
}

const FriendProfileMessageHeader: React.FC<FriendProfileMessageHeaderProps> = ({ imageSource, name, onPress }) => {
  return (
    <View style={styles.friend_profile_container}>
      <Link href="/HomePage" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Link>
      {onPress ? (
        <TouchableOpacity onPress={onPress} style={styles.friendContainer}>
          <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
          <Text style={styles.profileNameText}>{name}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.friendContainer}>
          <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
          <Text style={styles.profileNameText}>{name}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  friend_profile_container: {
    flexDirection: 'row',
    alignItems: 'center', // Center children vertically
    borderBottomWidth: 1,
    borderBottomColor: '#EBF7FE',
    marginBottom: 2,
  },
  backButton: {
    marginLeft: 10,
  },
  friendContainer: {
    flex: 1, // Take up remaining space
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 38,
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

export default FriendProfileMessageHeader;
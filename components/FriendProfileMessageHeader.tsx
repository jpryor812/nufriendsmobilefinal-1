import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

interface FriendProfileMessageHeaderProps {
  id: string;
  name: string;
  avatar: any;
  onPress?: () => void;
}

const FriendProfileMessageHeader: React.FC<FriendProfileMessageHeaderProps> = ({ 
  id,
  name, 
  avatar,
  onPress 
}) => {
  const router = useRouter();

  const handleFriendPress = () => {
      if (onPress) {
          onPress();
          return;
      }

      router.push({
          pathname: '/RelationshipTracker',
          params: { 
              id: id
          }
      });
  };

  return (
    <View style={styles.friend_profile_container}>
      <Link href="/HomePage" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Link>
      <TouchableOpacity onPress={handleFriendPress} style={styles.friendContainer}>
        <Image source={avatar} style={styles.profilePicture} resizeMode="contain" />
        <Text style={styles.profileNameText}>{name}</Text>
      </TouchableOpacity>
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
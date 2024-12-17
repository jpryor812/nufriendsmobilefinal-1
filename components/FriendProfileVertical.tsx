import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from expo
import { useRouter, Link } from 'expo-router';

interface FriendProfileVerticalProps {
  imageSource: ImageSourcePropType;
  name: string;
  onPress: () => void;
  onEditName?: () => void;
  onEditCity?: () => void;
}

const FriendProfileVertical: React.FC<FriendProfileVerticalProps> = ({ 
  imageSource, 
  name, 
  onPress,
  onEditName,
  onEditCity 
}) => {
  const router = useRouter();  // Inside the component

  const handleEditAvatar = () => {
    router.push('/AvatarCustomization')
  };

  return (
    <View style={styles.friend_profile_container}>
      <View style={styles.friendContainer}>
        <View style={styles.itemContainer}>
          <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
          <TouchableOpacity 
          style={styles.editIcon} 
          onPress={handleEditAvatar}
        >
          <Feather name="edit-2" size={14} color="#666" />
        </TouchableOpacity>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.profileNameText}>{name}</Text>
        </View>
          <Text>Pittsburgh, PA</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friend_profile_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  friendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: 80,
    height: 80,
    marginBottom: -10,
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  editIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

});

export default FriendProfileVertical;
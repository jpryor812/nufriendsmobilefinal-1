import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from expo

interface FriendProfileVerticalProps {
  imageSource: ImageSourcePropType;
  name: string;
  onPress: () => void;
  onEditImage?: () => void;
  onEditName?: () => void;
  onEditCity?: () => void;
}

const FriendProfileVertical: React.FC<FriendProfileVerticalProps> = ({ 
  imageSource, 
  name, 
  onPress,
  onEditImage,
  onEditName,
  onEditCity 
}) => {
  return (
    <View style={styles.friend_profile_container}>
      <View style={styles.friendContainer}>
        <View style={styles.itemContainer}>
          <Image source={imageSource} style={styles.profilePicture} resizeMode="contain" />
          <TouchableOpacity 
            style={styles.editIcon} 
            onPress={onEditImage}
          >
            <Feather name="edit-2" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.profileNameText}>{name}</Text>
          <TouchableOpacity 
            style={styles.editIcon} 
            onPress={onEditName}
          >
            <Feather name="edit-2" size={10} color="#666" />
          </TouchableOpacity>
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
    marginBottom: 8,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  editIcon: {
    position: 'absolute',
    bottom: -8,
    right: -20,
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
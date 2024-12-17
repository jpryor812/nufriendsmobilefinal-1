import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase'; // Adjust path to your Firebase config
import { avatarStyles } from '@/constants/avatarData';
import { router } from 'expo-router';
import Continue from '@/components/ContinueButton';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';


interface AvatarItem {
  id: string;
  image: any;
  locked?: boolean;
  defaultUnlocked?: boolean;
  achievement?: string;
  requirementText?: string;
}
interface Props {
  userId: string;
  unlockedItems?: string[]; 
}
interface HeaderItem {
  id: string;
  isHeader: true;
  isFullWidth: true;
}

const AvatarCustomization = ({ unlockedItems = [] }: Props) => {  // Remove userId from Props
  const { user } = useAuth();  // Add this line to get user
  
  const handleBack = () => {
    router.back();
  };
  
  // Modify the lock status logic
  const avatarsWithLockStatus = avatarStyles.map(avatar => ({
    ...avatar,
    locked: !(avatar.defaultUnlocked || unlockedItems.includes(avatar.id))
  }));

  const [isSaving, setIsSaving] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarItem>(
    avatarsWithLockStatus.find(avatar => !avatar.locked) || avatarsWithLockStatus[0]
  );

  const { width: screenWidth } = Dimensions.get('window');
  const showroomWidth = screenWidth * 0.75;
  const showcaseImageWidth = showroomWidth * 0.8;
  const thumbnailSize = (screenWidth * 0.4 * 0.45);

  // Create data array with header
  const dataWithHeader: ListItem[] = [
    ...avatarsWithLockStatus.filter(avatar => !avatar.locked),
    { id: 'header', isHeader: true, isFullWidth: true },
    { id: 'header-spacer', isHeader: true, isFullWidth: true },
    ...avatarsWithLockStatus.filter(avatar => avatar.locked),
  ];

  const handleAvatarSelect = (avatar: AvatarItem) => {
    if (!avatar.locked) {
      setSelectedAvatar(avatar);
    }
  };

  const handleContinue = async () => {
    if (!selectedAvatar || isSaving || !user?.uid) {
      console.log('Missing required data:', { selectedAvatar, isSaving, userId: user?.uid });
      return;
    }
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);  // Use user.uid here

      await updateDoc(userRef, {
        'avatar.currentOutfit': {
          id: selectedAvatar.id
        }
      });
      
      console.log('Successfully updated currentOutfit:', selectedAvatar.id);
      router.push('/(tabs)/HomePage');
    } catch (error) {
      console.error('Firebase error:', error);
    } finally {
      setIsSaving(false);
    }
  };

type ListItem = AvatarItem | HeaderItem;

const handleGoToAchievements = async () => {
    if (!selectedAvatar || isSaving || !user?.uid) {
      console.log('Missing required data:', { selectedAvatar, isSaving, userId: user?.uid });
      return;
    }
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
  
      await updateDoc(userRef, {
        'avatar.currentOutfit': {
          id: selectedAvatar.id
        }
      });
      
      console.log('Successfully updated currentOutfit:', selectedAvatar.id);
      router.push('/AchievementsPage');
    } catch (error) {
      console.error('Firebase error:', error);
    } finally {
      setIsSaving(false);
    }
  };

const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
  if ('isHeader' in item && item.isFullWidth) {
    if (item.id === 'header-spacer') return null;
      
      return (
        <View style={[styles.sectionHeader, { width: screenWidth * 0.42 - 20 }]}>
          <Text style={styles.sectionHeaderText} numberOfLines={4}>
            Unlock Premium Avatars by Earning Achievements
          </Text>
        </View>
      );
    }

    // Render avatar item
    if ('image' in item) {
      return (
        <TouchableOpacity
          style={[
            styles.avatarOption,
            {
              width: thumbnailSize,
              height: thumbnailSize * 1.44,
            },
            selectedAvatar.id === item.id && styles.selectedOption,
          ]}
          onPress={() => handleAvatarSelect(item)}
          activeOpacity={item.locked ? 1 : 0.7}
        >
          <View style={styles.avatarWrapper}>
            <Image 
              source={item.image} 
              style={[
                styles.thumbnailImage,
                item.locked && styles.lockedImage,
              ]}
              resizeMode="contain"
            />
            {item.locked && (
              <View style={styles.lockOverlay} />
            )}
          </View>
        </TouchableOpacity>
      );
    }
  
    return null; // Handle any other cases
  };

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        >
        <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      {/* Showroom View (Left Side) */}
      <View style={styles.showroomContainer}>
        <Image
          source={selectedAvatar.image}
          style={[
            styles.showcaseImage,
            {
              width: showcaseImageWidth,
              height: showcaseImageWidth * 1.44,
            }
          ]}
          resizeMode="contain"
        />
<Continue 
  onPress={handleGoToAchievements} 
  isLoading={isSaving}
  text="Go to Achievements" // Assuming your Continue component accepts a text prop
/>
</View>

      {/* Style Selector (Right Side) */}
      <View style={[styles.selectorContainer, { width: screenWidth * 0.42 }]}>
        <FlatList
          data={dataWithHeader}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.optionsContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  showroomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  selectorContainer: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  showcaseImage: {
    alignSelf: 'center',
  },
  optionsContainer: {
    padding: 10,
  },
  avatarOption: {
    margin: '2.5%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  selectedOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedImage: {
    opacity: 0.3,
    tintColor: '#000',
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    width: '200%',  // Changed from 200%
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 2,  // Add some space below the header
    flex: 1,          // Take up full width
    marginHorizontal: 2, // Add some horizontal padding
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',  // Allow text to wrap
  },
    backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
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

export default AvatarCustomization;
import { Tabs } from "expo-router";
import { Image } from 'react-native';
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { avatarStyles } from '@/constants/avatarData';

export default function TabsLayout() {
  const { user, onboardingProgress } = useAuth();
  const [currentAvatar, setCurrentAvatar] = useState<any>(null);
  
  useEffect(() => {
    const fetchCurrentAvatar = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const currentOutfitId = userDoc.data()?.avatar?.currentOutfit?.id;

        if (currentOutfitId) {
          // Find the avatar image from your avatarStyles
          const avatar = avatarStyles.find(a => a.id === currentOutfitId);
          if (avatar) {
            setCurrentAvatar(avatar.image);
          }
        }
      } catch (error) {
        console.error('Error fetching current avatar:', error);
      }
    };

    fetchCurrentAvatar();
  }, [user?.uid]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F0FCFE',
          borderTopWidth: 1,
          borderTopColor: '#EBF7FE',
          height: 68,
          marginTop: 2,
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="HomePage"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/house_emoji.png')}
              style={{
                width: 34,
                height: 34,
                marginTop: 10,
                marginBottom: 4,
                opacity: focused ? 1 : 0.5,
                // Optional: add tint color to match your design
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      
      {/* You can mix images and icons if you want */}
      <Tabs.Screen
        name="ProfilePage"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={currentAvatar || require('../../assets/images/profile_picture.jpg')} // Fallback to default if no avatar
              style={{
                width: 34,
                height: 40,
                marginTop: 10,
                marginBottom: 1,
                borderRadius: 25,
                opacity: focused ? 1 : 0.5,
              }}
              resizeMode="cover"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="FriendPage"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/hand_progress_bar.png')}
              style={{
                width: 34,
                height: 34,
                marginTop: 10,
                marginBottom: 4,
                opacity: focused ? 1 : 0.5,
                // Optional: add tint color
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ChatRoomYu"
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/yu_progress_bar.png')}
              style={{
                width: 38,
                height: 38,
                marginTop: 10,
                marginBottom: 4,
                opacity: focused ? 1 : 0.5,
                // Optional: add tint color
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
import { Tabs } from "expo-router";
import { Image } from 'react-native';

export default function TabsLayout() {
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
              source={require('../../assets/images/profile_picture.jpg')}
              style={{
                width: 34,
                height: 34,
                marginTop: 10,
                marginBottom: 4,
                borderRadius: 25,
                opacity: focused ? 1 : 0.5,
                // Don't use tintColor for profile pictures
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
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" 
      options={{ headerShown: false }} />
      <Stack.Screen name="about" 
      options={{ headerShown: false }} />
      <Stack.Screen name="HomePage"
      options={{ headerShown: false }} />
      <Stack.Screen name="ProfilePage"
      options={{ headerShown: false }} />
      <Stack.Screen name="FriendPage"
      options={{ headerShown: false }} />
      <Stack.Screen name="MessagingYu"
      options={{ headerShown: false }} />
      <Stack.Screen name="ChatRoomYu"
      options={{ headerShown: false }} />
      <Stack.Screen name="ChatRoomFriend"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage1"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage2"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage3"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage4"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage5"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPage6"
      options={{ headerShown: false }} />
    </Stack>
  );
}

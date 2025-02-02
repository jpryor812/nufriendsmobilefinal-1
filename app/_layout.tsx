import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import { MessagingProvider } from "@/contexts/MessageContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MessagingProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false // Global setting for all screens
        }}
      >
              <Stack.Screen name="index" 
      options={{ headerShown: false }} />
        {/* Add the tabs group first */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            // Prevent header from showing in the tabs group
            header: () => null,
          }} 
        />
      <Stack.Screen name="about" 
      options={{ headerShown: false }} />
      <Stack.Screen name="RelationshipTracker"
      options={{ headerShown: false }} />
      <Stack.Screen name="MessagingYu"
      options={{ headerShown: false }} />
      <Stack.Screen name="ChatRoomFriend"
      options={{ headerShown: false }} />
      <Stack.Screen name="ChatRoomNewFriend"
      options={{ headerShown: false }} />
      <Stack.Screen name="FindNewFriends"
      options={{ headerShown: false }} />
      <Stack.Screen name="FindingFriends"
      options={{ headerShown: false }} />
      <Stack.Screen name="UpgradeToPremium"
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
      <Stack.Screen name="OnboardingSendMessages"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingMessageWithYuSuggestions"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPreQuestions"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPreQuestionsCreateAccount"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPreQuestions2"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingBasicQuestions"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion1"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion2"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion3"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion4"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion5"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion6"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion7"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingQuestion8"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPostQuestions"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPostQuestions2"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingStartSearching"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingChatRoomYu"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPreProfile"
      options={{ headerShown: false }} />
      <Stack.Screen name="ProfilePageOnboarding"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingPreAvatarReveal"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingRelationshipTracker"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingAvatarReveal"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingAvatarCustomization"
      options={{ headerShown: false }} />
       <Stack.Screen name="AccountManagement"
      options={{ headerShown: false }} />
        <Stack.Screen name="Settings"
      options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingEditProfile"
      options={{ headerShown: false }} />
      <Stack.Screen name ="AvatarCustomization"
      options={{ headerShown: false }} />
      <Stack.Screen name ="AchievementsPage"
      options={{ headerShown: false }} />
    </Stack>
    </MessagingProvider>
    </AuthProvider>
  );
}

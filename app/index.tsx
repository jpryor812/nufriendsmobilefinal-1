import { Text, View, StyleSheet, Button } from "react-native";
import { Link } from "expo-router";
import MessagesChart from "@/components/MessagesChart";
import 'expo-router/entry';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/config/firebase';  // Import the initialized app
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';

// Get instances after Firebase is initialized
const auth = getAuth(app);
const db = getFirestore(app);

const testDirectFirestore = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    const userDoc = await getDoc(doc(db, 'users', userId));
    console.log('Direct Firestore read:', userDoc.data());
  } catch (error) {
    console.error('Direct Firestore error:', error);
  }
};

export default function Index() {
  const handleGenerateAllSummaries = async () => {
    try {
      const generateAllSummaries = httpsCallable(functions, 'generateAllUserSummaries');
      const result = await generateAllSummaries();
      console.log('Generation complete:', result.data);
    } catch (error) {
      console.error('Error generating summaries:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MessagesChart />
      <Text>Hello all</Text>
      
      {/* Add the test button here */}
      <Button 
        title="Test Direct Firestore" 
        onPress={testDirectFirestore} 
      />
      
      <Button 
        title="Generate All Summaries (Admin)" 
        onPress={handleGenerateAllSummaries}
      />
      
      <Link href={"/OnboardingPage6"} style={styles.button}>
        About
      </Link>
      <Link href={"/HomePage"} style={styles.button}>
        Home
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 24,
    color: "blue",
  },
});
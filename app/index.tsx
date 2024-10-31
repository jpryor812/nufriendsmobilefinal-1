import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import MessagesChart from "@/components/MessagesChart";

export default function Index() {
  return (
    <View style={styles.container}>
      <MessagesChart />
            <Text>Hello all</Text>
    <Link href={"/about"} style={styles.button}>
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
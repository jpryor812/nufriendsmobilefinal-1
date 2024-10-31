import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text, Image, Animated } from "react-native";

interface SearchingBubbleProps {
  stopAnimation?: boolean;
}

const SearchingBubble: React.FC<SearchingBubbleProps> = ({ stopAnimation }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    if (stopAnimation) {
      animationRef.current?.stop();
      bounceAnim.setValue(0);
      return;
    }

    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    );

    animationRef.current.start();

    return () => animationRef.current?.stop();
  }, [stopAnimation]);

  return (
    <View style={styles.BubbleContainer}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Image 
          source={require("../assets/images/magnifying_glass_emoji.png")} 
          style={styles.MagnifyingGlass} 
        />
      </Animated.View>
      <Text style={styles.BubbleText}>Searching...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  BubbleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 30,
    padding: 8,
    paddingHorizontal: 20,
    backgroundColor: "#35D662",
    width: '54%',
  },
  MagnifyingGlass: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  BubbleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default SearchingBubble;
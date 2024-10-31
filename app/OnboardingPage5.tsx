import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Animated, Platform, UIManager, Image } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';
import ChatBubble from '../components/ChatBubble'; 
import BigYuSearching from '../components/BigYuSearching';
import SearchingBubble from '../components/SearchingBubble';
import OnboardingFriendListAnimation from '../components/OnboardingFriendListAnimation';
import { router } from 'expo-router';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(false);
  }
}

const OnboardingPage5 = () => {
  const slideOutAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chatBubbleFadeAnim = useRef(new Animated.Value(0)).current;
  const bubbleFadeAnim = useRef(new Animated.Value(0)).current;
  const firstImageVisible = useRef(true);
  const [showList, setShowList] = useState(false); // Define showList state
  const [friendCount, setFriendCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const [searchText, setSearchText] = useState("We'll Find Five Friends You'll Build a Connection With!");


  const friends = [
    {
      imageSource: require('../assets/images/profile_picture.jpg'),
      name: "Jpp123",
    },
    {
      imageSource: require('../assets/images/profile-800x800.png'),
      name: "PChak55",
    },
    {
      imageSource: require('../assets/images/profile2-500x500.png'),
      name: "AlexD33",
    },
    {
      imageSource: require('../assets/images/asian_girl_avatar.jpg'),
      name: "Ajones01",
    },
    {
      imageSource: require('../assets/images/profile3-500x500.png'),
      name: "OnDeck02",
    },
  ];

  useEffect(() => {
    if (friendCount === 5) {
      const timer = setTimeout(() => {
        setSearchText("Then, You'll see a conversation begin on your behalf based on you and your new friend's interests...");
        setTimeout(() => {
          router.push('/OnboardingPage6');
        }, 6500);
      }, 1500);
      return () => clearTimeout(timer);
    }
   }, [friendCount]);


  useEffect(() => {
    // Reset all animations
    fadeAnim.setValue(0);
    slideUpAnim.setValue(300);
    slideOutAnim.setValue(0);
    chatBubbleFadeAnim.setValue(0);
    bubbleFadeAnim.setValue(0);
    setFriendCount(0);

    const timer = setTimeout(() => {
      // First animation: slide out
      Animated.timing(slideOutAnim, {
        toValue: 400,
        duration: 800,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          firstImageVisible.current = false;
          // Short delay before second animation
          setTimeout(() => {
            Animated.sequence([
              // First fade in the image
              Animated.parallel([
                Animated.timing(slideUpAnim, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
                }),
              ]),
              // Then fade in chat bubble and bottom bubble together
              Animated.parallel([
                Animated.timing(chatBubbleFadeAnim, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }),
                Animated.timing(bubbleFadeAnim, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
            ]).start(() => {
              setShowCount(true);
              // Show the list after all animations complete
              setTimeout(() => {
                setShowList(true);
              }, 1500); // Wait 1 second after bubbles appear
            });
          }, 800);
        }
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      // Reset animations on cleanup
      fadeAnim.setValue(0);
      slideUpAnim.setValue(300);
      slideOutAnim.setValue(0);
      chatBubbleFadeAnim.setValue(0);
      bubbleFadeAnim.setValue(0);
      setFriendCount(0);
    };
  }, []);

  // Create an Animated version of ChatBubble
  const AnimatedChatBubble = Animated.createAnimatedComponent(ChatBubble);

  return (
    <View style={styles.appContainer}>
      <ProgressBar progress={25} />
      
      <View style={styles.newContentContainer}>
        {/* First component that slides out */}
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ translateX: slideOutAnim }],
              zIndex: firstImageVisible.current ? 2 : 1,
            }
          ]}
        >
          <BigYuOnboarding text="After You Answer Some Questions to Help Us Get to Know You..." />
        </Animated.View>
  
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ translateY: slideUpAnim }],
              opacity: fadeAnim,
              zIndex: firstImageVisible.current ? 1 : 2,
            }
          ]}
        >
          <BigYuSearching text={searchText} />
        </Animated.View>
  
        {/* Bottom bubble that fades in below image */}
        <Animated.View
          style={[
            styles.bubbleContainer,
            {
              opacity: bubbleFadeAnim,
            }
          ]}
        >
          <SearchingBubble stopAnimation={friendCount === 5} />
        </Animated.View>
  
        {showCount && (
          <Animated.View
            style={[
              styles.countContainer,
              {
                opacity: bubbleFadeAnim, // Use same animation as search bubble
              }
            ]}
          >
            <Text style={styles.countText}>
              Found {friendCount}/5 Friends So Far...
            </Text>
          </Animated.View>
        )}

        {showList && (
          <View style={styles.listContainer}>
            <OnboardingFriendListAnimation 
              friends={friends}
              startDelay={0}
              itemDelay={1200}
              onFriendAppear={() => setFriendCount(prev => Math.min(prev + 1, 5))}
            />
          </View>
        )}
      </View>
    </View>
  );
}; // <-- Closing brace and parenthesis for the component function

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#F0FCFE',
  },
  newContentContainer: {
    position: 'absolute',
    top: '14%',
    width: '100%',
    height: '70%', // Add height to contain absolute positioned children
    alignItems: 'center',
  },
  animatedContainer: {
    position: 'absolute',
    top: '6%', // Adjust this value as needed
    width: '100%',
    alignItems: 'center',
  },
  bubbleContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: '42%', 
  },
  bubble: {
    backgroundColor: '#6ECFFF',
    borderRadius: 20,
    padding: 15,
    minWidth: 120,
    alignItems: 'center',
  },
  bubbleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  YuSearching: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    width: '60%',
    alignItems: 'center',
    marginTop: '99%',
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 8,
  },
  countContainer: {
    position: 'absolute',
    bottom: '36%', // Adjust this value to position between search bubble and friend list
    width: '100%',
    alignItems: 'center',
  },
});

export default OnboardingPage5;
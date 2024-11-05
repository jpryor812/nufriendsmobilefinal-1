import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Image,
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import YuGeneratedResponseContainer from './YuGeneratedResponseContainer';
import {Link} from 'expo-router';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface YuSuggestionsOnboardingProps {
  onSelectContent: (content: string) => void;
  onClose: () => void;
}

const quickReplies = [
  { id: '1', text: "Ask Jpp123 if he's ever played in a tournament before" },
  { id: '2', text: "Ask Jpp123 if he has any favorite cards or strategies" },
  { id: '3', text: "Ask Jpp123 where the tournament is being held" },
  { id: '4', text: "Start a new conversation/HELP!" },
];

const YuSuggestionsOnboarding: React.FC<YuSuggestionsOnboardingProps> = ({ onSelectContent, onClose }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const replyAnimations = useRef<Animated.Value[]>(
    quickReplies.map(() => new Animated.Value(0))
  ).current;
  const selectedAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const responseContainerAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;


  const resetState = () => {
    setSelectedId(null);
    setAnimationComplete(false);
    setAnimationPhase(0);
    replyAnimations.forEach(anim => {
      anim.setValue(0);
    });
    selectedAnimation.setValue(SCREEN_HEIGHT);
  };
  
  const handleReplySelect = (id: string, text: string) => {
    setSelectedId(id);
    const selectedIndex = quickReplies.findIndex(reply => reply.id === id);
    
    // Phase 1: Slide all items out
    const slideOutAnimations = replyAnimations.map((anim) => {
      return Animated.timing(anim, {
        toValue: SCREEN_HEIGHT,
        duration: 600,
        useNativeDriver: true,
      });
    });

    // Run all animations in sequence
    Animated.parallel(slideOutAnimations).start(() => {
      setAnimationPhase(1);
      
      // Then do the rest of the animations in sequence
      Animated.sequence([
        // Wait a brief moment
        Animated.delay(200),
        
        // Move selected item from bottom to slightly above final position
        Animated.timing(selectedAnimation, {
          toValue: -20,
          duration: 600,
          useNativeDriver: true,
        }),
        
        // Settle into final position with a small bounce
        Animated.spring(selectedAnimation, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        
        // Add delay before response container
        Animated.delay(200),
        
        // Slide in response container
        Animated.spring(responseContainerAnimation, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start(() => {
        setAnimationPhase(2);
        setAnimationComplete(true);
      });
    });
};
const handleSendMessage = (text: string) => {
  console.log('YuSuggestions received message:', text); // Debug log
  onSelectContent(text); // Pass to ChatRoomFriend
  onClose();
};

  const handleEditMessage = (text: string) => {
    // Handle editing the message
    console.log('Editing message:', text);
  };

  const handleSuggestChanges = () => {
    // Handle suggesting changes
    console.log('Suggesting changes');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.header,
        animationComplete && styles.headerCompleted
      ]}>
        <Image source={require('../assets/images/yu_progress_bar.png')} style={styles.Yu} />
        <Text style={styles.title}>Suggestions From Yu</Text>
        <TouchableOpacity 
          onPress={animationComplete ? resetState : onClose}
          style={styles.headerButton}
        >
          <View style={styles.headerButtonContent}>
            <Ionicons 
              name={animationComplete ? "arrow-back" : "chevron-down"}
              size={24} 
              color={Colors.gray}
            />
            {animationComplete && (
              <Text style={styles.backText}>Go back</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* Regular replies that slide out */}
        {quickReplies.map((reply, index) => (
          <Animated.View
            key={reply.id}
            style={[
              styles.replyButtonContainer,
              {
                transform: [
                  { 
                    translateY: replyAnimations[index]
                  }
                ],
                opacity: animationPhase === 0 ? 1 : 0,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => handleReplySelect(reply.id, reply.text)}
              disabled={selectedId !== null}
            >
              <Text style={styles.replyText}>{reply.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Selected reply that slides back in */}
        {selectedId && (
          <Animated.View
            style={[
              styles.replyButtonContainer,
              styles.selectedContainer,
              {
                transform: [{ translateY: selectedAnimation }],
                opacity: animationPhase >= 1 ? 1 : 0,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.replyButton, styles.selectedReplyButton]}
              disabled={true}
            >
              <Text style={styles.replyText}>
                {quickReplies.find(reply => reply.id === selectedId)?.text}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
                {/* Generated Response Container */}
                {selectedId && (
          <Animated.View
            style={[
              styles.responseContainer,
              {
                transform: [{ translateY: responseContainerAnimation }],
                opacity: animationPhase >= 1 ? 1 : 0,
              },
            ]}
          >
          <YuGeneratedResponseContainer
            selectedPrompt={quickReplies.find(reply => reply.id === selectedId)?.text || ''}
            onSendMessage={handleSendMessage}
            onEditMessage={handleEditMessage}
            onSuggestChanges={handleSuggestChanges}
            onClose={onClose}
          />
        </Animated.View>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    height: 380,
  },
  Yu: {
    height: 42,
    width: 42,
    marginLeft: 8,
  },
  YuUseCounter: {
    fontSize: 9,
    color: Colors.gray,
  },
  MoreYu: {
    fontSize: 9,
    color: Colors.gray,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderBottomWidth: 1,
    padding: 2,
    borderBottomColor: Colors.lightGray,
  },
  headerCompleted: {
  },
  lowerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    gap: 12,
    marginLeft: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 32,
    color: "#42ade2",
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: "#8d8d8d",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  replyButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    paddingVertical: 2,
  },
  selectedContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  replyButton: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 2,
    borderWidth: 2,
    borderColor: '#e9e9e9',
    backgroundColor: '#57C7FF',
  },
  selectedReplyButton: {
    borderColor: '#e9e9e9',
    backgroundColor: '#57C7FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  replyText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  backText: {
    fontSize: 12,
    color: Colors.gray,
  },
  headerButtonContent:{
  },
  headerButton: {
    position: 'absolute',
    right: 24,
  },
  responseContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 40, // Adjust this value to position below the selected reply
  },
});

export default YuSuggestionsOnboarding;
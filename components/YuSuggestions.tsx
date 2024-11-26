/*
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Colors from '@/assets/Colors';
import YuGeneratedResponseContainer from './YuGeneratedResponseContainer';
import { useAIMessaging } from '@/contexts/MessageContext';
import { useMessaging } from '@/contexts/MessageContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface YuSuggestionsProps {
  onSelectContent: (content: string) => void;
  onClose: () => void;
}

const YuSuggestions: React.FC<YuSuggestionsProps> = ({ onSelectContent, onClose }) => {
  const { currentConversation } = useMessaging();
  const { getMessageSuggestions, aiUsageCount, aiUsageLimit } = useAIMessaging();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const replyAnimations = useRef<Animated.Value[]>(
    Array(4).fill(0).map(() => new Animated.Value(0))
  ).current;
  const selectedAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const responseContainerAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (currentConversation?.id) {
      getMessageSuggestions(currentConversation.id)
        .then(setSuggestions)
        .catch(console.error);
    }
  }, [currentConversation?.id]);

  const resetState = () => {
    setSelectedId(null);
    setAnimationComplete(false);
    setAnimationPhase(0);
    replyAnimations.forEach(anim => {
      anim.setValue(0);
    });
    selectedAnimation.setValue(SCREEN_HEIGHT);
  };
  
  const handleReplySelect = (id: string) => {
    setSelectedId(id);
    const selectedIndex = suggestions.findIndex(reply => reply.id === id);
    
    // Phase 1: Slide all items out
    const slideOutAnimations = replyAnimations.map((anim) => {
      return Animated.timing(anim, {
        toValue: SCREEN_HEIGHT,
        duration: 600,
        useNativeDriver: true,
      });
    });

    Animated.parallel(slideOutAnimations).start(() => {
      setAnimationPhase(1);
      
      Animated.sequence([
        Animated.delay(200),
        
        Animated.timing(selectedAnimation, {
          toValue: -20,
          duration: 600,
          useNativeDriver: true,
        }),
        
        Animated.spring(selectedAnimation, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        
        Animated.delay(200),
        
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
    onSelectContent(text);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, animationComplete && styles.headerCompleted]}>
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

      <View style={styles.lowerHeader}>
        <Text style={styles.YuUseCounter}>{aiUsageCount}/{aiUsageLimit} used this week</Text>
        <Link href="/UpgradeToPremium">
          <Text style={styles.MoreYu}>Want more?</Text>
        </Link>
      </View>

      <View style={styles.content}>
        {suggestions.map((suggestion, index) => (
          <Animated.View
            key={suggestion.id}
            style={[
              styles.replyButtonContainer,
              {
                transform: [{ translateY: replyAnimations[index] }],
                opacity: animationPhase === 0 ? 1 : 0,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => handleReplySelect(suggestion.id)}
              disabled={selectedId !== null}
            >
              <Text style={styles.replyText}>{suggestion.preview}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

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
                {suggestions.find(s => s.id === selectedId)?.preview}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

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
              selectedPrompt={suggestions.find(s => s.id === selectedId)?.preview || ''}
              onSendMessage={handleSendMessage}
              onEditMessage={() => {}}
              onSuggestChanges={() => {}}
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
    marginLeft: 10,
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
    marginTop: 12,
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
    top: 60, // Adjust this value to position below the selected reply
  },
});

export default YuSuggestions;
*/
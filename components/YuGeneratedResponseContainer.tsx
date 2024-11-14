import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '@/assets/Colors';

interface YuGeneratedResponseContainerProps {
  selectedPrompt: string;
  onSendMessage: (text: string) => void;
  onEditMessage: (text: string) => void;
  onSuggestChanges: (text: string) => void;
  onClose: () => void;
}
 
const promptMap = {
    "1": "Ask Jpp123 if he's ever played in a tournament before",
    "2": "Ask Jpp123 if he has any favorite cards or strategies",
    "3": "Talk about your past experiences with playing Magic",
    "4": "Ask Jpp123 if he plays any other card or board games"
  };

  const preWrittenResponses = {
    "1": "Oh nice, good luck defending your title! Have you played in many tournaments before? Was the last one your first win or have you won a few?",
    "2": "Nice, good luck at the tournament! What's your favorite deck strategy to play? I always love hearing about other players' favorite cards and combos!",
    "3": "That's awesome about your tournament! I haven't competed in a while, but I used to run a mono-black control deck back in the day that did pretty well at my local game store. Made it to the finals once but got absolutely crushed by this incredible angel deck! Are you playing any particular strategy for defending your title?",
    "4": "That's exciting about your Magic tournament! Do you compete in any other card games or board game tournaments too? I've always wondered about trying some competitive Pokémon TCG or even chess tournaments myself."
};
  
  // Then update the getPromptId function
  const getPromptId = (prompt: string): string => {
      for (const [id, promptText] of Object.entries(promptMap)) {
          if (prompt.includes(promptText)) {
              return id;
          }
      }
      return "1"; // default fallback
  };

const YuGeneratedResponseContainer: React.FC<YuGeneratedResponseContainerProps> = ({
  selectedPrompt,
  onSendMessage,
  onEditMessage,
  onSuggestChanges,
  onClose
}) => {
    
    const [messageText, setMessageText] = useState('');
    const [suggestionText, setSuggestionText] = useState(''); // New state for suggestion input

      useEffect(() => {
        const promptId = getPromptId(selectedPrompt) as keyof typeof preWrittenResponses;
        setMessageText(preWrittenResponses[promptId] || '');
      }, [selectedPrompt]);
  
      const handleSendMessage = () => {
          if (messageText.trim()) {
            console.log('Sending message:', messageText);
            onSendMessage(messageText);
            setMessageText('');
            onClose();
          }
      };

  return (
    <View style={styles.container}>

      {/* Message Text Area */}
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.messageInput}
          multiline
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Your message..."
          placeholderTextColor={'#888888'}
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.mainButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => onEditMessage(messageText)}
          >
            <Text style={styles.secondaryButtonText}>Edit Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleSendMessage}
        >
            <Text style={styles.primaryButtonText}>Send Message</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.suggestionContainer}>
        <TextInput
          style={styles.messageInput}
          multiline
          value={suggestionText}
          onChangeText={setSuggestionText}
          placeholder="Suggest changes for Yu to tweak the message..."
          placeholderTextColor={'#888888'}
          textAlignVertical="top"
        />
      </View>

        <TouchableOpacity 
          style={styles.suggestButton} 
          onPress={() => onSuggestChanges(suggestionText)} // Pass suggestion text
        >
          <Text style={styles.suggestButtonText}>Suggest Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  messageContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    marginVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 84,
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    color: '#444444',
  },
  buttonsContainer: {
    gap: 6,
  },
  mainButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 48,
    marginHorizontal: 36,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFE074'
  },
  secondaryButton: {
    backgroundColor: '#FFE074',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  primaryButtonText: {
    color: '#444444',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#444444',
    fontSize: 12,
    fontWeight: '600',
  },
  suggestButton: {
    borderRadius: 20,
    backgroundColor: '#FFE074',
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 84
  },
  suggestButtonText: {
    color: '#444444',
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    marginVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 40, 
  },
});

export default YuGeneratedResponseContainer;
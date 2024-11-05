import React, { useState } from 'react';
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

const YuGeneratedResponseContainer: React.FC<YuGeneratedResponseContainerProps> = ({
  selectedPrompt,
  onSendMessage,
  onEditMessage,
  onSuggestChanges,
  onClose
}) => {
    const [messageText, setMessageText] = useState('');
    const [suggestionText, setSuggestionText] = useState(''); // New state for suggestion input

    const handleSendMessage = () => {
        if (messageText.trim()) {
          console.log('Sending message:', messageText); // Debug log
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
    marginVertical: 8,
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
    paddingVertical: 10,
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
    marginVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 40, 
  },
});

export default YuGeneratedResponseContainer;
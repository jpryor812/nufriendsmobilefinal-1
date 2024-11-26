/*
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '@/assets/Colors';
import { useAIMessaging } from '@/contexts/AIMessagingContext';

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
  onClose
}) => {
  const { generateResponse, modifyResponse } = useAIMessaging();
  const [messageText, setMessageText] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateInitialResponse = async () => {
      if (!selectedPrompt) return;
      
      setIsLoading(true);
      try {
        const response = await generateResponse(selectedPrompt);
        setMessageText(response.content);
      } catch (error) {
        console.error('Error generating response:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateInitialResponse();
  }, [selectedPrompt]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
      onClose();
    }
  };

  const handleSuggestChanges = async () => {
    if (!suggestionText.trim()) return;

    setIsLoading(true);
    try {
      const modifiedResponse = await modifyResponse(messageText, suggestionText);
      setMessageText(modifiedResponse.content);
      setSuggestionText('');
    } catch (error) {
      console.error('Error modifying response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.messageInput}
          multiline
          value={messageText}
          onChangeText={setMessageText}
          placeholder={isLoading ? "Generating response..." : "Your message..."}
          placeholderTextColor={Colors.gray}
          textAlignVertical="top"
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.mainButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => setMessageText('')}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.button, 
              styles.primaryButton,
              isLoading && styles.disabledButton
            ]} 
            onPress={handleSendMessage}
            disabled={isLoading || !messageText.trim()}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Generating..." : "Send Message"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionContainer}>
          <TextInput
            style={styles.messageInput}
            multiline
            value={suggestionText}
            onChangeText={setSuggestionText}
            placeholder="Suggest changes for Yu to tweak the message..."
            placeholderTextColor={Colors.gray}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.suggestButton,
            (!suggestionText.trim() || isLoading) && styles.disabledButton
          ]} 
          onPress={handleSuggestChanges}
          disabled={!suggestionText.trim() || isLoading}
        >
          <Text style={styles.suggestButtonText}>
            {isLoading ? "Modifying..." : "Suggest Changes"}
          </Text>
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default YuGeneratedResponseContainer;
*/
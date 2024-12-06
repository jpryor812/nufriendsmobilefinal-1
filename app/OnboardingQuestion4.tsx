import ProgressBar from '@/components/ProgressBar';
import BigYuOnboarding from '@/components/BigYuOnboarding';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';  // Add this import
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,  // Add this import
} from 'react-native';
import SafeLayout from '@/components/SafeLayout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingQuestion4Props {
  onSubmit?: (text: string) => void;
}

const OnboardingQuestion4: React.FC<OnboardingQuestion4Props> = ({ onSubmit }) => {
  const { updateOnboardingResponse, getOnboardingStatus } = useAuth();
  const [text, setText] = useState<string>('');
  const [inputHeight, setInputHeight] = useState<number>(18);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();

  const MIN_CHARS = 20;
  const MAX_CHARS = 400;

  const updateSize = (height: number) => {
    setInputHeight(Math.max(18, Math.min(height, 72)));
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    setCharCount(newText.length);
    setError(''); // Clear any previous errors
  };

  const isValidResponse = () => {
    return charCount >= MIN_CHARS && charCount <= MAX_CHARS && !loading;
  };

  const handleSend = async () => {
    if (!isValidResponse()) {
      setError(`Answer must be between ${MIN_CHARS} and ${MAX_CHARS} characters`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update Firebase with the response
      await updateOnboardingResponse('music', text);

    // Log the answer
    console.log('Question 4 Answer:', {
      question: "Do you listen to music? What are your favorite genres and artists?",
      answer: text,
      timestamp: new Date().toISOString(),
    });

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(text);
    }

    // Clear the input
    setText('');
    setCharCount(0);

    // Dismiss keyboard
    Keyboard.dismiss();

    // Navigate to next page
    router.push('/OnboardingQuestion5');
  } catch (err) {
    console.error('Error saving response:', err);
    setError('Failed to save your answer. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeLayout style={styles.appContainer}>
          <ProgressBar progress={50} />
          <BigYuOnboarding 
            text={"Question 3: \nDo you listen to music? What are your favorite genres and artists?"} 
          />
          <View style={styles.questionHeader}>
          <View style={styles.questionCounterContainer}>
          <Text style={styles.label}>Question 3/6</Text>
          </View>
          <View style={styles.characterInfo}>
            <Text style={styles.requirementText}>
              Please write between {MIN_CHARS}-{MAX_CHARS} characters
            </Text>
            <Text style={styles.charCount}>
              {charCount}/{MAX_CHARS}
            </Text>
          </View>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

          <View style={[
            styles.inputContainer, 
            { minHeight: Math.max(inputHeight + 18, 45) }
          ]}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Type your answer here..."
                placeholderTextColor="#A3A3A3"  
                keyboardType="default"
                value={text}
                onChangeText={handleTextChange}
                style={[
                  styles.input,
                  { height: Math.max(inputHeight, 18) }
                ]}
                multiline
                onContentSizeChange={(event) => 
                  updateSize(event.nativeEvent.contentSize.height)
                }
                textAlignVertical="top"
                editable={!loading}
              />
              <View style={styles.iconsContainer}>
                <TouchableOpacity disabled={loading}>
                  <Ionicons 
                    name="mic" 
                    color={loading ? Colors.lightGray : Colors.primary} 
                    size={20} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSend}
                  disabled={!isValidResponse()}
                  style={[
                    styles.iconButton,
                    !isValidResponse() && styles.iconButtonDisabled
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Ionicons 
                      name="send" 
                      color={!isValidResponse() ? Colors.lightGray : Colors.primary} 
                      size={20} 
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Optional helper text */}
          {text.length > 0 && text.length < MIN_CHARS && (
            <Text style={styles.helperText}>
              Please write at least {MIN_CHARS} characters
            </Text>
          )}
        </SafeLayout>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0FCFE',
    },
    appContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
    },
    label: {
      fontSize: 10,
      fontWeight: '500',
      marginBottom: 4,
      textAlign: 'right',
      width: '80%', 
      color: '#9100C3'
    },
    questionCounterContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
      paddingHorizontal: 24,
    },
    inputContainer: {
      width: SCREEN_WIDTH * 0.9,
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: 'white',
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: '#333',
      paddingTop: 0,
      paddingBottom: 0,
      lineHeight: 22,
      paddingRight: 4, // Add some padding to prevent text from touching icons
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingTop: 6, // Align icons with first line of text
    },
    iconButton: {
      padding: 4,
    },
    iconButtonDisabled: {
      opacity: 0.5,
    },
      iconButtonActive: {
      backgroundColor: '#FFE5E5',
      borderRadius: 12,
    },
    questionHeader: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginBottom: 2,
    },
    charCount: {
      fontSize: 12,
      color: Colors.gray,
    },
    characterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24, // Space between requirement text and counter
      marginBottom: 2,
    },
    errorText: {
      color: "#FF0000",
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
      marginBottom: 8,
    },
    requirementText: {
      fontSize: 12,
      color: Colors.gray,
    },
    helperText: {
      fontSize: 12,
      color: "#FF0000",
      textAlign: 'center',
      marginBottom: 4,
    },
  });

export default OnboardingQuestion4;
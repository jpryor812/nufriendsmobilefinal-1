import ProgressBar from '@/components/ProgressBar';
import BigYuOnboarding from '@/components/BigYuOnboarding';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
} from 'react-native';
import SafeLayout from '@/components/SafeLayout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingQuestion1Props {
  onSubmit?: (text: string) => void;
}

const OnboardingPage6: React.FC<OnboardingQuestion1Props> = ({ onSubmit }) => {
  const [text, setText] = useState<string>('');
  const [inputHeight, setInputHeight] = useState<number>(18);
  const router = useRouter();

  const updateSize = (height: number) => {
    setInputHeight(Math.max(18, Math.min(height, 72)));
  };

  const handleSend = () => {
    if (text.trim() === '') {
      // Optionally add some validation or alert here
      return;
    }

    // Log the answer
    console.log('Question 6 Answer:', {
      question: 'Do you have any favorite TV shows, movies, or books? If so, what are they and why do you enjoy them?',
      answer: text,
      timestamp: new Date().toISOString(),
    });

    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(text);
    }

    // Clear the input
    setText('');

    // Dismiss keyboard
    Keyboard.dismiss();

    // Navigate to next page
    router.push('/OnboardingQuestion7'); // Replace with your actual next route
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeLayout style={styles.appContainer}>
          <ProgressBar progress={56} />
          <BigYuOnboarding 
            text={`Question 6: \nDo you have any favorite TV shows, movies, or books? If so, what are they and why do you enjoy them?`} 
          />
          <Text style={styles.label}>Question 6/8</Text>
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
                onChangeText={setText}
                style={[
                  styles.input,
                  { height: Math.max(inputHeight, 18) }
                ]}
                multiline
                onContentSizeChange={(event) => 
                  updateSize(event.nativeEvent.contentSize.height)
                }
                textAlignVertical="top"
              />
              <View style={styles.iconsContainer}>
              <TouchableOpacity>
                  <Ionicons name="mic" color={Colors.primary} size={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSend}
                  disabled={text.trim() === ''}
                  style={[
                    styles.iconButton,
                    text.trim() === '' && styles.iconButtonDisabled
                  ]}
                >
                  <Ionicons 
                    name="send" 
                    color={text.trim() === '' ? Colors.lightGray : Colors.primary} 
                    size={20} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    marginTop: 16,
    textAlign: 'right',
    width: '80%', 
    color: '#9100C3'
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
    lineHeight: 18,
    paddingRight: 8,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  iconButton: {
    padding: 4,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
});

export default OnboardingPage6;
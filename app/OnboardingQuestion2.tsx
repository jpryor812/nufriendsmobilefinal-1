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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingQuestion1Props {
  onSubmit?: (text: string) => void;
}

const OboardingPage1: React.FC<OnboardingQuestion1Props> = ({ onSubmit }) => {
  const [text, setText] = useState<string>('');
  const [inputHeight, setInputHeight] = useState<number>(20);
  const router = useRouter();

  const updateSize = (height: number) => {
    setInputHeight(Math.max(20, Math.min(height, 80)));
  };

  const handleSend = () => {
    if (text.trim() === '') {
      // Optionally add some validation or alert here
      return;
    }

    // Log the answer
    console.log('Question 1 Answer:', {
      question: 'Where are you from? Was there anything you liked or disliked about your hometown?',
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
    router.push('/OnboardingQuestion2'); // Replace with your actual next route
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.appContainer}>
          <ProgressBar progress={35} />
          <BigYuOnboarding 
            text={`Question 2: \nWhere are you from? Was there anything you liked or disliked about your hometown?`} 
          />
          <Text style={styles.label}>Question 1/10</Text>
          <View style={[
            styles.inputContainer, 
            { minHeight: Math.max(inputHeight + 20, 45) }
          ]}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Type your answer here..."
                keyboardType="default"
                value={text}
                onChangeText={setText}
                style={[
                  styles.input,
                  { height: Math.max(inputHeight, 20) }
                ]}
                multiline
                onContentSizeChange={(event) => 
                  updateSize(event.nativeEvent.contentSize.height)
                }
                textAlignVertical="top"
              />
              <View style={styles.iconsContainer}>
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
                    size={22} 
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="add" color={Colors.primary} size={22} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
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

export default OboardingPage1;
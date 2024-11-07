import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  IMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/assets/Colors';
import ProgressBar from '../components/ProgressBar';
import BigYuOnboarding from '../components/BigYuOnboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingQuestion1 = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[
          { backgroundColor: Colors.background },
          styles.inputToolbar
        ]}
        renderSend={null}
        renderActions={null}
        primaryStyle={styles.inputPrimaryStyle}
      />
    );
  };

  const onSend = (messages: IMessage[]) => {
    if (messages.length > 0) {
      navigation.navigate('OnboardingPage11');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ProgressBar progress={10} />
        <View style={styles.contentContainer}>
          <BigYuOnboarding 
            text={`Question 1: \nWhere are you from? Was there anything you liked or disliked about your hometown?`} 
          />
        </View>
        <View style={styles.inputWrapper}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            isKeyboardInternallyHandled={true}
            keyboardShouldPersistTaps="handled"
            minInputToolbarHeight={36}
            maxInputToolbarHeight={100}
            minComposerHeight={36}
            bottomOffset={insets.bottom}
            renderAvatar={null}
            maxComposerHeight={200}
            textInputProps={{
              ...styles.composer,
              placeholder: "Type your answer here...",
              multiline: true,
            }}
            renderInputToolbar={renderInputToolbar}
            renderMessages={() => null}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    paddingBottom: 20,
    backgroundColor: '#F0FCFE',
  },
  inputToolbar: {
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: 20,
    borderRadius: 18,
    backgroundColor: 'white',
  },
  inputPrimaryStyle: {
    alignItems: 'center',
  },
  composer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    textAlignVertical: 'center',
    backgroundColor: 'white',
    maxHeight: 200,
    width: SCREEN_WIDTH * 0.9,
  },
});

export default OnboardingQuestion1;
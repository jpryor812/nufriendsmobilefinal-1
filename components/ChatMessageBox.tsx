import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IMessage, Message, MessageProps } from 'react-native-gifted-chat';
import { isSameDay, isSameUser } from 'react-native-gifted-chat/lib/utils';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

interface ExtendedIMessage extends IMessage {
  messageType?: 'text' | 'voice' | 'image';
  mediaUrl?: string;
}

type ChatMessageBoxProps = MessageProps<ExtendedIMessage>;

const ChatMessageBox = (props: ChatMessageBoxProps) => {
  const { currentMessage } = props;

  const isNextMyMessage =
    props.currentMessage &&
    props.nextMessage &&
    isSameUser(props.currentMessage, props.nextMessage) &&
    isSameDay(props.currentMessage, props.nextMessage);

  const renderMessageContent = () => {
    if (!currentMessage) return null;

    switch (currentMessage.messageType) {
      case 'voice':
        return <VoiceMessageContent uri={currentMessage.mediaUrl || ''} />;
      case 'image':
        return <ImageMessageContent uri={currentMessage.mediaUrl || ''} />;
      default:
        return <Message {...props} />;
    }
  };

  return (
    <GestureHandlerRootView>
      {renderMessageContent()}
    </GestureHandlerRootView>
  );
};

const VoiceMessageContent = ({ uri }: { uri: string }) => {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playSound = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  React.useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <TouchableOpacity onPress={playSound} style={styles.voiceMessage}>
      <Ionicons 
        name={isPlaying ? "pause" : "play"} 
        size={24} 
        color={Colors.primary} 
      />
      <Text style={styles.voiceText}>Voice Message</Text>
    </TouchableOpacity>
  );
};

const ImageMessageContent = ({ uri }: { uri: string }) => {
  console.log('Image URI received in ImageMessageContent:', uri);

  const [error, setError] = React.useState(false);

  if (!uri) {
    console.log('No URI provided to ImageMessageContent');
    return (
      <View style={styles.imageContainer}>
        <Text>No image available</Text>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri }} 
        style={styles.image}
        resizeMode="cover"
        onError={(e) => {
          console.error('Image loading error:', e.nativeEvent.error);
          setError(true);
        }}
        onLoad={() => console.log('Image loaded successfully')}
      />
      {error && <Text>Failed to load image</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
  },
  replyImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyImage: {
    width: 20,
    height: 20,
  },
  defaultBottomOffset: {
    marginBottom: 2,
  },
  bottomOffsetNext: {
    marginBottom: 10,
  },
  leftOffsetValue: {
    marginLeft: 16,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  voiceText: {
    marginLeft: 8,
    color: Colors.primary,
  },
  imageContainer: {
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: 200,
    height: 200,
  }
});

export default ChatMessageBox;
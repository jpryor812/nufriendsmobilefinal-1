import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { useMessaging } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';

interface ActionMenuProps {
  conversationId: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { sendMessage } = useMessaging();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  // Permission states
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [hasLibraryPermission, setHasLibraryPermission] = useState<boolean | null>(null);
  const [menuLayout, setMenuLayout] = useState({ width: 0, height: 0 });

  // Check permissions on mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      const libraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasLibraryPermission(libraryStatus.status === 'granted');
    })();
  }, []);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
    setIsOpen(!isOpen);
  };

  // Handler functions
  const handleVoice = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      if (!hasAudioPermission) {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please allow microphone access.');
          return;
        }
        setHasAudioPermission(true);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setRecordingInstance(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingInstance) return;
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      if (uri) {
        console.log('Recording URI:', uri); // Debug log
        
        // Send with empty content since we have the audio URI
        await sendMessage(
          conversationId,
          '',  // empty content since we have audio
          'voice',
          uri
        );
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setRecordingInstance(null);
      setIsRecording(false);
    }
  };

  const handleCamera = async () => {
    if (!hasCameraPermission) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow camera access.');
        return;
      }
      setHasCameraPermission(true);
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        await sendMessage(conversationId, 'Photo', 'image', result.assets[0].uri);
        toggleMenu();
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleGallery = async () => {
    if (!hasLibraryPermission) {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access.');
        return;
      }
      setHasLibraryPermission(true);
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Create message in GiftedChat format
        const message = {
          _id: Date.now().toString(),
          image: imageUri,
          createdAt: new Date(),
          user: {
            _id: user?.uid || '',  // Now user is defined
            name: 'User',
          },
          sent: true,
          received: true,
        };

        await sendMessage(
          conversationId,
          '',  // content
          'image',  // type
          imageUri  // mediaUrl
        );
        toggleMenu();
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  type IconName = 'mic' | 'camera' | 'images';  // Add this type definition at the top

  interface MenuItem {
    icon: IconName;
    label: string;
    handler: () => void;
    color: string;
  }
  
  // Then update the menuItems definition
  const menuItems: MenuItem[] = [
    { 
      icon: 'mic', 
      label: 'Voice',
      handler: handleVoice,
      color: isRecording ? 'red' : Colors.primary
    },
    { 
      icon: 'camera', 
      label: 'Camera',
      handler: handleCamera,
      color: Colors.primary
    },
    { 
      icon: 'images', 
      label: 'Gallery',
      handler: handleGallery,
      color: Colors.primary
    },
  ];  

  return (
    <View 
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setMenuLayout({ width, height });
      }}
    >
      <View style={[styles.menuContainer, { zIndex: 1 }]}>
        {menuItems.map((item, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -64 * (index + 1)]
          });

          const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1]
          });

          return (
            <Animated.View
              key={item.icon}
              style={[
                styles.menuItem,
                {
                  transform: [{ translateY }],
                  opacity,
                  position: 'absolute',
                  bottom: menuLayout.height,
                  right: 0,
                  zIndex: 2
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: Colors.background }]}
                onPress={item.handler}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <TouchableOpacity 
        onPress={toggleMenu}
        style={styles.toggleButton}
      >
        <Animated.View
          style={{
            transform: [{
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg']
              })
            }]
          }}
        >
          <Ionicons name="add" color={Colors.primary} size={22} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 40,  // Add minimum height to ensure layout
    minWidth: 40,   // Add minimum width to ensure layout
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  menuButton: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 8,
    marginRight: 0,  // Removed right margin since we don't have labels
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toggleButton: {
    padding: 8,  // Add padding to make button more touchable
    zIndex: 3,   // Ensure toggle button stays on top
  },
  menuItem: {
    marginBottom: 8,
  },
});

export default ActionMenu;
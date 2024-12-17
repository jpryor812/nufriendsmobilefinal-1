// components/AchievementModal.tsx
import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/assets/Colors';

interface AchievementModalProps {
  visible: boolean;
  onClose: () => void;
  achievementType: 'avatar' | 'badge' | 'other'; // Add more types as needed
  achievementTitle?: string;
  achievementDescription?: string;
  navigateTo?: string; // Route to navigate to
}

const AchievementModal = ({
  visible,
  onClose,
  achievementType,
  achievementTitle = '🎉 Achievement Unlocked!',
  achievementDescription = "You've unlocked a new avatar!",
  navigateTo = '/avatar-customization'
}: AchievementModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.achievementTitle}>{achievementTitle}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>
          
          <Text style={styles.achievementText}>
            {achievementDescription}
          </Text>
          
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Continue</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                onClose();
                router.push('/OnboardingAvatarCustomization');
            }}
            >
              <Text style={styles.primaryButtonText}>Check it out!</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      width: '80%',
      maxWidth: 400,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    achievementTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    achievementText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
    },
    closeButton: {
      padding: 5,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 10,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: Colors.primary,
    },
    secondaryButton: {
      backgroundColor: '#f0f0f0',
    },
    primaryButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },
    secondaryButtonText: {
      color: '#666',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  export default AchievementModal;

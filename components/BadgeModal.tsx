// components/BadgeModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native';
import Achievement from './Achievement';
import { Image } from 'react-native-svg';

interface BadgeModalProps {
  visible: boolean;
  badge: {
    title: string;
    emoji?: string;
    imageSource?: ImageSourcePropType;
    isUnlocked: boolean;
    howToEarn: string;
  } | null;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ visible, badge, onClose }) => {
    if (!badge) return null;
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.badgeContainer}>
                <Achievement
                  title={badge.title}
                  emoji={badge.emoji}
                  imageSource={badge.imageSource} // Add this line
                  isUnlocked={badge.isUnlocked}
                  size={110}
                />
              </View>
              
              <Text style={styles.description}>{badge.howToEarn}</Text>
              
              <View style={styles.howToEarnContainer}>
                <Text style={styles.howToEarnTitle}>
                  {badge.isUnlocked ? 'What You Get:' : 'What You Earned:'}
                </Text>
                <Text style={styles.howToEarnText}>Items:</Text>
              </View>
  
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
  },
  badgeContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
    color: '#aaa',
    fontWeight: '500',
  },
  howToEarnContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  howToEarnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
  howToEarnText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#6ECFFF',
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BadgeModal;
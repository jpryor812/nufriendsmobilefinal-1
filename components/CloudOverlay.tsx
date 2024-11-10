// CloudOverlay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CloudOverlayProps {
    isLocked: boolean;
    level: number; // Add this prop
  }
  
  const CloudOverlay: React.FC<CloudOverlayProps> = ({ isLocked, level }) => {
    if (!isLocked) return null;
  
    return (
      <View style={styles.overlay}>
        <Text style={styles.lockText}>
          Complete Level {level - 1} to Unlock!
        </Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  cloudRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cloud: {
    fontSize: 40,
    opacity: 0.9,
    marginHorizontal: -5, // Overlap clouds slightly
  },
  lockText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CloudOverlay;
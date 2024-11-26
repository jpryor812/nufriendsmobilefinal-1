import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PremiumToggleProps {
  premiumType: 'premium' | 'social-butterfly';
  setpremiumType: (period: 'premium' | 'social-butterfly') => void;
}

const PremiumToggle: React.FC<PremiumToggleProps> = ({ 
    premiumType, 
    setpremiumType 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              premiumType === 'premium' && styles.activeButton
            ]}
            onPress={() => setpremiumType('premium')}
          >
            <Text style={[
              styles.toggleText,
              premiumType === 'premium' && styles.activeText
            ]}>
              Premium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.toggleButton,
              premiumType === 'social-butterfly' && styles.activeButton
            ]}
            onPress={() => setpremiumType('social-butterfly')}
          >
            <View style={styles.annualButtonContent}>
              <Text style={[
                styles.toggleText,
                premiumType === 'social-butterfly' && styles.activeText
              ]}>
                Social Butterfly
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeText: {
    color: '#2563EB',
  },
  annualButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  foundingMemberBonus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    alignSelf: 'flex-end',
    marginRight: 30,
    textAlign: 'center',
  },
  promoText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '500',
    // Optional: add some animation or styling to make it stand out
    borderRadius: 8,
    marginHorizontal: 16,
  },
});

export default PremiumToggle;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PricingToggle = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              billingPeriod === 'monthly' && styles.activeButton
            ]}
            onPress={() => setBillingPeriod('monthly')}
          >
            <Text style={[
              styles.toggleText,
              billingPeriod === 'monthly' && styles.activeText
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.toggleButton,
              billingPeriod === 'annual' && styles.activeButton
            ]}
            onPress={() => setBillingPeriod('annual')}
          >
            <View style={styles.annualButtonContent}>
              <Text style={[
                styles.toggleText,
                billingPeriod === 'annual' && styles.activeText
              ]}>
                Annual
              </Text>
              <Text style={styles.discountText}>-60%!</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.foundingMemberBonus}>*Founding Member Bonus!</Text>
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
    paddingVertical: 6,
    paddingHorizontal: 16,
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
    fontSize: 14,
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
});

export default PricingToggle;
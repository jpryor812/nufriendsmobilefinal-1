import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PremiumPriceProps {
  billingPeriod: 'monthly' | 'annual';
}

const PremiumPrice: React.FC<PremiumPriceProps> = ({ billingPeriod }) => {
    const monthlyPrice = 6.99;
    const annualEquivalent = 2.79;
    const twoYearTotal = 66.99;
  
    return (
      <View style={styles.container}>
        {billingPeriod === 'annual' && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalPayment}>
              ${twoYearTotal} payment for a two-year subscription
            </Text>
          </View>
        )}
        <View style={styles.priceSection}>
          <Text style={styles.equivalentText}>
            {billingPeriod === 'annual' ? 'Equivalent to:' : 'All of these amazing features for:'}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[
              styles.price,
              billingPeriod === 'annual' ? styles.annualPrice : styles.monthlyPrice
            ]}>
              ${billingPeriod === 'monthly' ? monthlyPrice : annualEquivalent}
            </Text>
            <Text style={styles.period}>/month</Text>
          </View>
          {billingPeriod === 'monthly' && (
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                Just one less cup of Starbucks per month! 😄
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: '#fff',
        borderRadius: 30,
        marginHorizontal: 32,
        marginTop: 2,
    },
    totalContainer: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 12,
      marginBottom: 4,
    },
    totalPayment: {
      fontSize: 10,
      color: '#6B7280',
      textAlign: 'center',
    },
    priceSection: {
      alignItems: 'center',
    },
    equivalentText: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 2,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    price: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    monthlyPrice: {
      color: '#1F2937', // Black
    },
    annualPrice: {
      color: '#10B981', // Green
    },
    period: {
      fontSize: 16,
      color: '#6B7280',
      marginLeft: 4,
    },
    bottomTextContainer: {
        marginTop: 2,
        },
    bottomText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        fontStyle: 'italic',
        },    
  });

export default PremiumPrice;
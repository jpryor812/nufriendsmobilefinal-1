import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PremiumPriceProps {
  billingPeriod: 'monthly' | 'annual';
  premiumType: 'premium' | 'social-butterfly';
}

const PremiumPrice: React.FC<PremiumPriceProps> = ({ billingPeriod, premiumType }) => {
    const prices = {
        premium: { monthly: 6.99, annual: 2.79 }, // Annual is equivalent per month
        'social-butterfly': { monthly: 9.99, annual: 3.25 }, // Example pricing
    };

    const twoYearTotal = premiumType === 'premium' ? 66.99 : 77.99; // Adjust for premium type

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
                        ${prices[premiumType][billingPeriod]}
                    </Text>
                    <Text style={styles.period}>/month</Text>
                </View>
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
        marginTop: 12,
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
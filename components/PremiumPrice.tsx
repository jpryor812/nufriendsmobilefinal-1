import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PremiumPrice: React.FC = () => {
    return (
        <View style={styles.container}>
        <View style={styles.priceContainer}>
            <Text style={styles.priceText}>$6.99/month</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: '#eee',
        marginTop: 6,
    },
    priceContainer: {
        padding: 10,
        backgroundColor: '#fff',
        width: '50%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 6,
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default PremiumPrice;
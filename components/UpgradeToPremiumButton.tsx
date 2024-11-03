import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UpgradeToPremiumButton: React.FC = () => {
    return (
        <View style={styles.container}>
        <View style={styles.priceContainer}>
            <Text style={styles.priceText}>✨Upgrade To Premium!</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceContainer: {
        padding: 12,
        backgroundColor: '#3AB4FF',
        width: '80%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    priceText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default UpgradeToPremiumButton;
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceContainer: {
        padding: 10,
        backgroundColor: '#3AB4FF',
        width: '80%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    priceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default UpgradeToPremiumButton;
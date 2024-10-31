import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { messageData } from './MessageData';

interface StatsBarProps {
  currentWeek: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ currentWeek }) => {
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate total messages
  const totalMessages = messageData.reduce((sum, message) => sum + message.count, 0);

  // Calculate messages in February
  const februaryMessages = messageData
    .filter(message => message.date.startsWith('2024-02'))
    .reduce((sum, message) => sum + message.count, 0);

  const stats = [
    { number: '34', label: 'New Friends This Month' },
    { number: '139', label: 'Total Friends' },
    { number: formatNumber(februaryMessages), label: 'Messages Sent This Month' },
    { number: formatNumber(totalMessages), label: 'Total Messages Sent' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {stats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          {index > 0 && <View style={styles.separator} />}
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  statBlock: {
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
    marginLeft: 4,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    marginBottom: 10,
    marginRight: 2,
    marginLeft: 2,
    width: 80,
    textAlign: 'center',
  },
  separator: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
});

export default StatsBar;
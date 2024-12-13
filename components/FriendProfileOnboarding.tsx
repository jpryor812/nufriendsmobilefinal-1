import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/assets/Colors';
import ScrollSafeLayout from './ScrollSafeLayout';

interface FriendProfileOnboardingProps {
  friend: {
    demographics: {
      city: string;
      state: string;
      gender: string;
      age: number;
    };
    profileSummaries: {
      goals: string;
      travel: string;
      entertainment: string;
      location: string;
      hobbies: string;
      music: string;
    };
  };
}

const FriendProfileOnboarding: React.FC<FriendProfileOnboardingProps> = ({ friend }) => {
  const displayNames = {
    'location': 'Born In',
    'hobbies': 'Hobbies',
    'music': 'Favorite Music',
    'entertainment': 'Favorite Content',
    'travel': 'Best Trip',
    'goals': 'Goals'
  };

  return (
    <ScrollSafeLayout>
    <View style={styles.container}>
      {/* Basic Details */}
      <View style={styles.details}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            {friend.demographics.city}, {friend.demographics.state}
          </Text>
          <Text style={styles.detailText}>{friend.demographics.gender}</Text>
          <Text style={styles.detailText}>{friend.demographics.age} years-old</Text>
        </View>
      </View>
      
      {/* Profile Summaries */}
      {friend.profileSummaries && (
        <View style={styles.summaryContainer}>
          {Object.entries(friend.profileSummaries)
            .filter(([key]) => key !== 'isVisible')
            .map(([key, value]) => (
              <View key={key} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {displayNames[key as keyof typeof displayNames]}:
                </Text>
                <Text style={styles.summaryValue}>{value}</Text>
              </View>
            ))}
        </View>
      )}
    </View>
    </ScrollSafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  details: {
    marginBottom: 8,
  },
  detailContainer: {
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
    textAlign: 'center',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#42ade2',
    marginBottom: 12,
  },
  summaryRow: {
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FriendProfileOnboarding;
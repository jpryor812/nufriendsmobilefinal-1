import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import BigYuSearching from "@/components/BigYuSearching";
import SearchingBubble from "@/components/SearchingBubble";
import { friendsData } from '../constants/FriendsData';
import FoundFriendProfile from "@/components/FoundFriendProfile";
import SafeLayout from '@/components/SafeLayout';

interface Friend {
  id: number;
  initials: string;
  name: string;
  messages: number;
  daysAsFriends: number;
  streak: number;
  mutualFriends: number;
  avatar: any;
  city: string;
  state: string;
  country: string;
  age: number;
  gender: string;
}

interface Filters {
  cities: string[];
  states: string[];
  countries: string[];
  genders: string[];
}

type ScreenState = 'checking' | 'searching' | 'found' | 'no-matches';

const FindingFriends: React.FC = () => {
  const params = useLocalSearchParams();
  const [screenState, setScreenState] = useState<ScreenState>('checking');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const filterFriends = (filters: Filters) => {
    let filteredFriends = [...friendsData];

    if (filters.cities.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.cities.includes(friend.city)
      );
    }
    if (filters.states.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.states.includes(friend.state)
      );
    }
    if (filters.countries.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.countries.includes(friend.country)
      );
    }
    if (filters.genders.length > 0) {
      filteredFriends = filteredFriends.filter(friend => 
        filters.genders.includes(friend.gender)
      );
    }

    return filteredFriends;
  };

  // Initial check for matches
  React.useEffect(() => {
    const filters: Filters = params.filters ? JSON.parse(params.filters as string) : {
      cities: [],
      states: [],
      countries: [],
      genders: []
    };

    const matchingFriends = filterFriends(filters);

    if (matchingFriends.length === 0) {
      setScreenState('no-matches');
    } else {
      setScreenState('searching');
      // Only start the search timer if we have matches
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * matchingFriends.length);
        setSelectedFriend(matchingFriends[randomIndex]);
        setScreenState('found');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [params.filters]);

  const renderContent = () => {
    switch (screenState) {
      case 'checking':
        return null;
      
      case 'searching':
        return (
          <>
            <BigYuSearching text="Hang tight! I'll find your new friend as soon as possible!" />
            <SearchingBubble />
            <Text style={styles.WaitTime}>Estimated Wait Time: 10 seconds</Text>
          </>
        );
      
      case 'no-matches':
        return (
          <Text style={styles.noMatchText}>
            No friends found matching your criteria. Try broadening your search!
          </Text>
        );
      
      case 'found':
        return selectedFriend ? (
          <FoundFriendProfile friend={selectedFriend} />
        ) : (
          <Text>Debug: No friend selected</Text>
        );
    }
  };

  return (
    <SafeLayout style={styles.container}>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  Yu: {
    width: 120,
    marginTop: 80,
    marginBottom: 12,
  },
  WaitTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9d9d9d',
    marginTop: 10,
  },
  matchText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#42ade2',
  },
  noMatchText: {
    fontSize: 16,
    color: '#9d9d9d',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FindingFriends;
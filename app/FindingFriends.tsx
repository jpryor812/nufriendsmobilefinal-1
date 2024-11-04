import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from 'expo-router';
import BigYuSearching from "@/components/BigYuSearching";
import FooterNavigation from "@/components/FooterNavigation";
import SearchingBubble from "@/components/SearchingBubble";
import {friendsData} from '../constants/FriendsData';
import FoundFriendProfile from "@/components/FoundFriendProfile";

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
    // Add other friend properties as needed
  }
  
  interface Filters {
    cities: string[];
    states: string[];
    countries: string[];
    genders: string[];
  }
  
  const FindingFriends: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [searching, setSearching] = useState(true);
  
    useEffect(() => {
      const filters: Filters = params.filters ? JSON.parse(params.filters as string) : {
        cities: [],
        states: [],
        countries: [],
        genders: []
      };
  
      console.log('Received filters:', filters);

      const filterFriends = () => {
        let filteredFriends = [...friendsData];
        console.log('Starting number of friends:', filteredFriends.length);
  
        if (filters.cities.length > 0) {
            console.log('Filtering by cities:', filters.cities);
            filteredFriends = filteredFriends.filter(friend => {
              const cityMatch = filters.cities.includes(friend.city);
              console.log(`Friend ${friend.name} from ${friend.city}: ${cityMatch ? 'matches' : 'doesn\'t match'}`);
              return cityMatch;
            });
            console.log('Friends after city filter:', filteredFriends.map(f => `${f.name} (${f.city}, ${f.state})`));
          }
        if (filters.states.length > 0) {
            console.log('Filtering by states:', filters.states);
            filteredFriends = filteredFriends.filter(friend => {
              const stateMatch = filters.states.includes(friend.state);
              console.log(`Friend ${friend.name} from ${friend.state}: ${stateMatch ? 'matches' : 'doesn\'t match'}`);
              return stateMatch;
            });
            console.log('Friends after state filter:', filteredFriends.map(f => `${f.name} (${f.state})`));
          }
  
          if (filters.countries.length > 0) {
            console.log('Filtering by countries:', filters.countries);
            filteredFriends = filteredFriends.filter(friend => {
              const countryMatch = filters.countries.includes(friend.country);
              console.log(`Friend ${friend.name} from ${friend.country}: ${countryMatch ? 'matches' : 'doesn\'t match'}`);
              return countryMatch;
            });
            console.log('Friends after country filter:', filteredFriends.map(f => 
              `${f.name} (${f.country})`
            ));
          }
  
          if (filters.genders.length > 0) {
            console.log('Filtering by genders:', filters.genders);
            filteredFriends = filteredFriends.filter(friend => {
              const genderMatch = filters.genders.includes(friend.gender);
              console.log(`Friend ${friend.name}, gender ${friend.gender}: ${genderMatch ? 'matches' : 'doesn\'t match'}`);
              return genderMatch;
            });
            console.log('Friends after gender filter:', filteredFriends.map(f => 
              `${f.name} (${f.gender})`
            ));
          }
        
          console.log('Final matching friends:', filteredFriends.map(f => 
            `${f.name} (${f.gender} from ${f.city}, ${f.state}, ${f.country})`
          ));
          return filteredFriends;
        };
  
      // Select random friend after delay
      const timer = setTimeout(() => {
        const matchingFriends = filterFriends();
        
        if (matchingFriends.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingFriends.length);
            const selected = matchingFriends[randomIndex];
            console.log('Selected friend:', {
              name: selected.name,
              gender: selected.name,
              city: selected.city,
              state: selected.state,
              country: selected.country,
            });
            setSelectedFriend(selected);
          } else {
            console.log('No matching friends found with the current filters');
          }
        
        setSearching(false);
      }, 6000);
  
      return () => clearTimeout(timer);
    }, [params.filters]);
  
    if (searching) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <BigYuSearching text="Hang tight! I'll find your new friend as soon as possible!" />
            <SearchingBubble />
            <Text style={styles.WaitTime}>Estimated Wait Time: 10 seconds</Text>
          </View>
          <FooterNavigation />
        </SafeAreaView>
      );
    }
  
    if (!selectedFriend) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.noMatchText}>
              No friends found matching your criteria. Try broadening your search!
            </Text>
          </View>
          <FooterNavigation />
        </SafeAreaView>
      );
    }
  
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
          {selectedFriend ? (
        <>
          <FoundFriendProfile friend={selectedFriend} />
        </>
      ) : (
        <Text>Debug: No friend selected</Text>
      )}
          </View>
          <FooterNavigation />
        </SafeAreaView>
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
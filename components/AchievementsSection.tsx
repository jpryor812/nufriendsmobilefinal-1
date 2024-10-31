import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import MessageAchievement from './MessageAchievement';
import StreakAchievement from './StreakAchievement';
import MutualFriendAchievement from './MutualFriendAchievement';
import WeeklyMessagesAchievement from './WeeklyMessagesAchievement';
import WeeklyNewFriendsAchievement from './WeeklyNewFriendsAchievement';
import YuUseAchievement from './YuUseAchievement';
import ReferFriendAchievement from './ReferFriendAchievement';
import FriendsMessagedInADayAchievement from './FriendsMessagedInADayAchievement';
import GroupChatsJoined from './GroupChatsJoinedAchievement';
import MysteryAchievements from './MysteryAchievements';
import TotalBadgesEarned from './TotalBadgesEarned';

const AchievementsSection = () => {
  return (
    <View>
      <Text style={styles.header}>Achievements</Text>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Messages Group */}
        <View style={styles.achievementGroup}>
          <MessageAchievement count={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={10} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={25} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={50} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={100} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={500} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={1000} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MessageAchievement count={2000} isLocked={true} />
        </View>

        {/* Streaks Group */}
        <View style={styles.achievementGroup}>
          <StreakAchievement days={2} fireCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <StreakAchievement days={5} fireCount={2} isLocked={false} />
          <View style={styles.horizontalLine} />
          <StreakAchievement days={10} fireCount={3} isLocked={true} />
          <View style={styles.horizontalLine} />
          <StreakAchievement days={25} fireCount={4} isLocked={true} />
          <View style={styles.horizontalLine} />
          <StreakAchievement days={50} fireCount={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <StreakAchievement days={100} fireCount={6} isLocked={true} />
        </View>

        {/* Mutual Friends Group */}
        <View style={styles.achievementGroup}>
          <MutualFriendAchievement friends={2} handCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MutualFriendAchievement friends={5} handCount={2} isLocked={false} />
          <View style={styles.horizontalLine} />
          <MutualFriendAchievement friends={10} handCount={3} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MutualFriendAchievement friends={25} handCount={4} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MutualFriendAchievement friends={50} handCount={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MutualFriendAchievement friends={100} handCount={6} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <WeeklyMessagesAchievement Messages={25} mailCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <WeeklyMessagesAchievement Messages={50} mailCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <WeeklyMessagesAchievement Messages={100} mailCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyMessagesAchievement Messages={250} mailCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyMessagesAchievement Messages={500} mailCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyMessagesAchievement Messages={1000} mailCount={1} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <WeeklyNewFriendsAchievement Friends={1} shakeCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <WeeklyNewFriendsAchievement Friends={3} shakeCount={2} isLocked={false} />
          <View style={styles.horizontalLine} />
          <WeeklyNewFriendsAchievement Friends={5} shakeCount={3} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyNewFriendsAchievement Friends={10} shakeCount={4} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyNewFriendsAchievement Friends={15} shakeCount={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <WeeklyNewFriendsAchievement Friends={20} shakeCount={6} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <YuUseAchievement requests={10} YuCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <YuUseAchievement requests={50} YuCount={2} isLocked={false} />
          <View style={styles.horizontalLine} />
          <YuUseAchievement requests={100} YuCount={3} isLocked={true} />
          <View style={styles.horizontalLine} />
          <YuUseAchievement requests={250} YuCount={4} isLocked={true} />
          <View style={styles.horizontalLine} />
          <YuUseAchievement requests={500} YuCount={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <YuUseAchievement requests={1000} YuCount={6} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <ReferFriendAchievement referals={1} WavingHand={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <ReferFriendAchievement referals={2} WavingHand={2} isLocked={true} />
          <View style={styles.horizontalLine} />
          <ReferFriendAchievement referals={3} WavingHand={3} isLocked={true} />
          <View style={styles.horizontalLine} />
          <ReferFriendAchievement referals={4} WavingHand={4} isLocked={true} />
          <View style={styles.horizontalLine} />
          <ReferFriendAchievement referals={5} WavingHand={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <ReferFriendAchievement referals={6} WavingHand={6} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <FriendsMessagedInADayAchievement friends={2} WavingHand={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <FriendsMessagedInADayAchievement friends={3} WavingHand={2} isLocked={false} />
          <View style={styles.horizontalLine} />
          <FriendsMessagedInADayAchievement friends={4} WavingHand={3} isLocked={false} />
          <View style={styles.horizontalLine} />
          <FriendsMessagedInADayAchievement friends={5} WavingHand={4} isLocked={false} />
          <View style={styles.horizontalLine} />
          <FriendsMessagedInADayAchievement friends={6} WavingHand={5} isLocked={true} />
          <View style={styles.horizontalLine} />
          <FriendsMessagedInADayAchievement friends={7} WavingHand={6} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <GroupChatsJoined Chats={1} shakeCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <GroupChatsJoined Chats={2} shakeCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <GroupChatsJoined Chats={3} shakeCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <GroupChatsJoined Chats={4} shakeCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <GroupChatsJoined Chats={5} shakeCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <GroupChatsJoined Chats={6} shakeCount={1} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <MysteryAchievements Mystery={1} QuestionMark={1} isLocked={true} />
        </View>

        <View style={styles.achievementGroup}>
          <TotalBadgesEarned Badges={2} trophyCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <TotalBadgesEarned Badges={5} trophyCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <TotalBadgesEarned Badges={10} trophyCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <TotalBadgesEarned Badges={15} trophyCount={1} isLocked={false} />
          <View style={styles.horizontalLine} />
          <TotalBadgesEarned Badges={25} trophyCount={1} isLocked={true} />
          <View style={styles.horizontalLine} />
          <TotalBadgesEarned Badges={50} trophyCount={1} isLocked={true} />
        </View>
      </ScrollView>
    </View>
  );
};
//If MysteryAchievement is earned, show text of what the achievement was

const styles = StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 10,
      flexDirection: 'column',
      alignItems: 'center',
      paddingVertical: 12,
    },
    achievementGroup: {
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center', 
      gap: 6, 
      marginLeft: '12%',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 12,
    },
    horizontalLine: {
      width: '10%',     // Make the line wider
      height: 1,        // Make the line thinner
      backgroundColor: '#ddd',
      marginHorizontal: 1,
    },
});

export default AchievementsSection;
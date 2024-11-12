export interface Achievement {
    id: number;
    title: string;
    emoji?: string;
    imageSource?: any;
    isUnlocked: boolean;
    howToEarn: string
  }
  
  export const badges: Achievement[] = [
    // Level 1 Badges
      {
        id: 1,
        title: 'Nice to Meet You',
        emoji: '🤝',
        isUnlocked: true,
        howToEarn: 'Send One Message'

      },
      {
        id: 2,
        title: 'Talk to you tomorrow',
        emoji: '👋',
        isUnlocked: true,
        howToEarn: 'Start a Streak'
      },
      {
        id: 3,
        title: 'You and Yu',
        imageSource: require('../assets/images/yu_progress_bar.png'),
        isUnlocked: true,
        howToEarn: 'Use Yu One Time'
      },
      {
        id: 4,
        title: "Chatting Away",
        emoji: '🤪',
        isUnlocked: true,
        howToEarn: 'Send 10 messages in a day'
      },
      {
        id: 5,
        title: 'Time Flies!',
        emoji: '🕒',
        isUnlocked: false,
        howToEarn: 'Be Friends for 7 days'
      },

    {
      id: 6,
      title: 'Do I Know You?',
      emoji: '🤔',
      isUnlocked: true,
      howToEarn: 'Find a Mutual Friend'
    }
  ];
export interface Achievement {
    id: number;
    title: string;
    emoji?: string;
    imageSource?: any;
    isUnlocked: boolean;
    level: number; // Added level for organizing badges
    howToEarn: string
  }
  
  export const badges: Achievement[] = [
    // Level 1 Badges
      {
        id: 1,
        title: 'Taking the First Step',
        emoji: '🧗',
        isUnlocked: true,
        level: 1,
        howToEarn: 'Send One Message'

      },
      {
        id: 2,
        title: 'You and Yu',
        imageSource: require('../assets/images/yu_progress_bar.png'),
        isUnlocked: true,
        level: 1,
        howToEarn: 'Use Yu One Time'
      },
      {
        id: 3,
        title: 'The start of something',
        emoji: '🏋️',
        isUnlocked: true,
        level: 1,
        howToEarn: 'Message One Friend'
      },
      {
        id: 4,
        title: "It's that easy?",
        emoji: '🎮',
        isUnlocked: true,
        level: 1,
        howToEarn: 'Find a New Friend'
      },
      {
        id: 5,
        title: 'Talk to you tomorrow',
        emoji: '👋',
        isUnlocked: true,
        level: 1,
        howToEarn: 'Start a Streak'
      },
    // ... more level 1 badges
    
    // Level 2 Badges
    {
      id: 6,
      title: 'Social Butterfly',
      emoji: '🦋',
      isUnlocked: true,
      level: 2,
      howToEarn: 'Send 25 Messages'
    },
    {
        id: 7,
        title: 'Friend Indeed',
        emoji: '🤝',
        isUnlocked: false,
        level: 2,
        howToEarn: 'Use Yu 10 Times'
      },
      {
        id: 8,
        title: 'Event Explorer',
        emoji: '🎉',
        isUnlocked: false,
        level: 2,
        howToEarn: 'Message Two Friends'
      },
      {
        id: 9,
        title: 'Active Networker',
        emoji: '🌟',
        isUnlocked: false,
        level: 2,
        howToEarn: 'Find Two New Friends'
      },
      {
        id: 10,
        title: 'Popularity Contest',
        emoji: '💭',
        isUnlocked: true,
        level: 2,
        howToEarn: 'Have Two Different Streaks'
      },
      {
        id: 11,
        title: 'Social Butterfly',
        emoji: '🦋',
        isUnlocked: false,
        level: 3,
        howToEarn: 'Send 100 Messages'
      },
      {
          id: 12,
          title: 'Friend Indeed',
          emoji: '🤝',
          isUnlocked: false,
          level: 3,
          howToEarn: 'Use Yu 25 Times'
        },
        {
          id: 13,
          title: 'Event Explorer',
          emoji: '🎉',
          isUnlocked: false,
          level: 3,
          howToEarn: 'Message Three Friends'
        },
        {
          id: 14,
          title: 'Active Networker',
          emoji: '🌟',
          isUnlocked: false,
          level: 3,
          howToEarn: 'Find Three New Friends'
        },
        {
          id: 15,
          title: 'Community Builder',
          emoji: '🏛️',
          isUnlocked: false,
          level: 3,
          howToEarn: 'Have Three Different Streaks'
        },
        {
            id: 16,
            title: 'Social Butterfly',
            emoji: '🦋',
            isUnlocked: false,
            level: 4,
            howToEarn: 'Send 250 Messages'
          },
          {
              id: 17,
              title: 'Friend Indeed',
              emoji: '🤝',
              isUnlocked: false,
              level: 4,
              howToEarn: 'Use Yu 100 Times'
            },
            {
              id: 18,
              title: 'Event Explorer',
              emoji: '🎉',
              isUnlocked: false,
              level: 4,
              howToEarn: 'Message Five Friends'
            },
            {
              id: 19,
              title: 'Active Networker',
              emoji: '🌟',
              isUnlocked: false,
              level: 4,
              howToEarn: 'Find Five New Friends'
            },
            {
              id: 20,
              title: 'Community Builder',
              emoji: '🏛️',
              isUnlocked: false,
              level: 4,
              howToEarn: 'Have Five Different Streaks'
            },

  ];
  
  // Helper function to get badges by level
  export const getBadgesByLevel = (level: number): Achievement[] => {
    return badges.filter(badge => badge.level === level);
  };
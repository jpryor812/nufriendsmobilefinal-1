export interface Achievement {
    id: number;
    title: string;
    emoji: string;
    isUnlocked: boolean;
    level: number; // Added level for organizing badges
  }
  
  export const badges: Achievement[] = [
    // Level 1 Badges
    {
        id: 1,
        title: 'Welcome to nufriends',
        emoji: '🌐',
        isUnlocked: true,
        level: 1
      },
      {
        id: 2,
        title: 'Taking the First Step',
        emoji: '🎯',
        isUnlocked: true,
        level: 1
      },
      {
        id: 3,
        title: 'Yu and You',
        emoji: '👥',
        isUnlocked: false,
        level: 1
      },
      {
        id: 4,
        title: 'The start of something special',
        emoji: '✨',
        isUnlocked: false,
        level: 1
      },
      {
        id: 5,
        title: 'Is that easy?',
        emoji: '🎮',
        isUnlocked: false,
        level: 1
      },
      {
        id: 6,
        title: 'Talk to you tomorrow',
        emoji: '👋',
        isUnlocked: false,
        level: 1
      },
    // ... more level 1 badges
    
    // Level 2 Badges
    {
      id: 7,
      title: 'Social Butterfly',
      emoji: '🦋',
      isUnlocked: false,
      level: 2
    },
    {
        id: 8,
        title: 'Friend Indeed',
        emoji: '🤝',
        isUnlocked: false,
        level: 2
      },
      {
        id: 9,
        title: 'Event Explorer',
        emoji: '🎉',
        isUnlocked: false,
        level: 2
      },
      {
        id: 10,
        title: 'Active Networker',
        emoji: '🌟',
        isUnlocked: false,
        level: 2
      },
      {
        id: 11,
        title: 'Community Builder',
        emoji: '🏛️',
        isUnlocked: false,
        level: 2
      },
      {
        id: 12,
        title: 'Conversation Master',
        emoji: '💭',
        isUnlocked: false,
        level: 2,
      },
    // ... more badges
  ];
  
  // Helper function to get badges by level
  export const getBadgesByLevel = (level: number): Achievement[] => {
    return badges.filter(badge => badge.level === level);
  };
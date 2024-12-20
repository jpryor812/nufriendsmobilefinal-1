// avatars.ts
interface AvatarItem {
    id: string;
    image: any;
    defaultUnlocked?: boolean;
    isPremium?: boolean;
    achievement?: string;
    requirementText?: string;
    messageCount?: number;
  }
  
  export const defaultAvatars: AvatarItem[] = [
    {
      id: 'default_avatar',
      image: require('../assets/avatars/avatar_default.png'),
      defaultUnlocked: true,
      isPremium: false
    },
    {
      id: 'solid_yellow',
      image: require('../assets/avatars/solid/solid_avatar_yellow.png'),
      defaultUnlocked: true,
      isPremium: true
    },
    {
      id: 'solid_green',
      image: require('../assets/avatars/solid/solid_avatar_green.png'),
      defaultUnlocked: true,
      isPremium: false
    },
    {
      id: 'solid_lightgreen',
      image: require('../assets/avatars/solid/solid_avatar_lightgreen.png'),
      defaultUnlocked: true,
      isPremium: true
    },
    {
      id: 'solid_orange',
      image: require('../assets/avatars/solid/solid_avatar_orange.png'),
      defaultUnlocked: true,
      isPremium: false
    },
    {
      id: 'solid_pink',
      image: require('../assets/avatars/solid/solid_avatar_pink.png'),
      defaultUnlocked: true,
      isPremium: true
    },
    {
      id: 'solid_purple',
      image: require('../assets/avatars/solid/solid_avatar_purple.png'),
      defaultUnlocked: true,
      isPremium: false
    },
    {
      id: 'solid_red',
      image: require('../assets/avatars/solid/solid_avatar_red.png'),
      defaultUnlocked: true,
      isPremium: true
    }
  ];
  
  export const achievementAvatars: AvatarItem[] = [
    {
      id: 'lightsaber_green',
      image: require('../assets/avatars/lightsaber/Avatar_1.png'),
      requirementText: 'Send your first message',
      achievement: 'FIRST_MESSAGE',
      messageCount: 1,
      isPremium: false
    },
    {
      id: 'lightsaber_blue',
      image: require('../assets/avatars/lightsaber/Avatar_2.png'),
      requirementText: 'Send your first message',
      achievement: 'FIRST_MESSAGE',
      messageCount: 1,
      isPremium: true
    },
    {
      id: 'lightsaber_red',
      image: require('../assets/avatars/lightsaber/Avatar_3.png'),
      requirementText: 'Send 5 messages',
      achievement: 'FIVE_MESSAGES',
      messageCount: 5,
      isPremium: false
    },
    {
      id: 'lightsaber_purple',
      image: require('../assets/avatars/lightsaber/Avatar.png'),
      requirementText: 'Send 5 messages',
      achievement: 'FIVE_MESSAGES',
      messageCount: 5,
      isPremium: true
    }
  ];
  
  // Helper function to get all avatars
  export const getAllAvatars = () => [...defaultAvatars, ...achievementAvatars];
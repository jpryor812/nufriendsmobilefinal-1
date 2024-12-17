interface AvatarItem {
    id: string;
    image: any;
    defaultUnlocked?: boolean;  // Make optional since achievement items won't have it
    achievement?: string;       // Optional for achievement-based items
    requirementText?: string;
  }
  
  export const avatarStyles: AvatarItem[] = [
      {
        id: 'default_avatar',
        image: require('../assets/avatars/avatar_default.png'),
        defaultUnlocked: true
    },
      // Solid avatars
      {
        id: 'solid_green',
        image: require('../assets/avatars/solid/solid_avatar_green.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_lightgreen',
        image: require('../assets/avatars/solid/solid_avatar_lightgreen.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_orange',
        image: require('../assets/avatars/solid/solid_avatar_orange.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_pink',
        image: require('../assets/avatars/solid/solid_avatar_pink.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_purple',
        image: require('../assets/avatars/solid/solid_avatar_purple.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_red',
        image: require('../assets/avatars/solid/solid_avatar_red.png'),
        defaultUnlocked: true
    },
      {
        id: 'solid_yellow',
        image: require('../assets/avatars/solid/solid_avatar_yellow.png'),
        defaultUnlocked: true
    },
      //small dots
      {
        id: 'small_dots_blue',
        image: require('../assets/avatars/small_dots/small_dots_blue.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_green',
        image: require('../assets/avatars/small_dots/small_dots_green.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_orange',
        image: require('../assets/avatars/small_dots/small_dots_orange.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_pink',
        image: require('../assets/avatars/small_dots/small_dots_pink.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_purple',
        image: require('../assets/avatars/small_dots/small_dots_purple.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_red',
        image: require('../assets/avatars/small_dots/small_dots_red.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_teal',
        image: require('../assets/avatars/small_dots/small_dots_teal.png'),
        defaultUnlocked: true
    },
      {
        id: 'small_dots_yellow',
        image: require('../assets/avatars/small_dots/small_dots_yellow.png'),
        defaultUnlocked: true
    },
      //lightsabers
      {
        id: 'lightsaber_green',
        image: require('../assets/avatars/lightsaber/Avatar_1.png'),
        achievement: 'FIRST_MESSAGE',
        requirementText: 'Send your first message'
      },
      {
        id: 'lightsaber_blue',
        image: require('../assets/avatars/lightsaber/Avatar_2.png'),
        achievement: 'FIVE_MESSAGES',
        requirementText: 'Send 5 messages'
      },
      {
        id: 'lightsaber_red',
        image: require('../assets/avatars/lightsaber/Avatar_3.png'),
        achievement: 'TEN_MESSAGES',
        requirementText: 'Send 10 messages'
      },
      {
        id: 'lightsaber_purple',
        image: require('../assets/avatars/lightsaber/Avatar.png'),
        achievement: 'FIFTEEN_MESSAGES',
        requirementText: 'Send 15 messages'
      },
    ];
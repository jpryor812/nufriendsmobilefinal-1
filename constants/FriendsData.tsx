export interface Friend {
    id: number;
    initials: string;
    name: string;
    messages: number;
    daysAsFriends: number;
    streak: number;
    mutualFriends: number;
    avatar: any; // or ImageSourcePropType from react-native
  }
  
  export const friendsData: Friend[] = [
    { 
      id: 1, 
      initials: 'JP', 
      name: 'Jpp123', 
      messages: 1298, 
      daysAsFriends: 156, 
      streak: 7, 
      mutualFriends: 12,
      avatar: require('../assets/images/profile_picture.jpg')
    },
    { 
      id: 2, 
      initials: 'AD', 
      name: 'AlexD33', 
      messages: 876, 
      daysAsFriends: 89, 
      streak: 4, 
      mutualFriends: 8,
      avatar: require('../assets/images/profile_icon.png')
    },
    { 
        id: 3, 
        initials: 'PC', 
        name: 'PChak55', 
        messages: 654, 
        daysAsFriends: 134, 
        streak: 9, 
        mutualFriends: 15,
        avatar: require('../assets/images/profile-800x800.png')
    },
    { 
        id: 4, 
        initials: 'OD', 
        name: 'OnDeck02', 
        messages: 445, 
        daysAsFriends: 67, 
        streak: 3, 
        mutualFriends: 6,
        avatar: require('../assets/images/profile2-500x500.png')
    },
    { 
        id: 5, 
        initials: 'AJ', 
        name: 'AJones01', 
        messages: 789, 
        daysAsFriends: 178, 
        streak: 12, 
        mutualFriends: 19,
        avatar: require('../assets/images/profile3-500x500.png')
    },
    { 
        id: 6, 
        initials: 'HP', 
        name: 'Hpp123', 
        messages: 567, 
        daysAsFriends: 45, 
        streak: 0, 
        mutualFriends: 7,
        avatar: require('../assets/images/profile_picture.jpg')
    },
    { 
        id: 7, 
        initials: 'TP', 
        name: 'Tpp123', 
        messages: 234, 
        daysAsFriends: 23, 
        streak: 0, 
        mutualFriends: 4,
        avatar: require('../assets/images/profile_picture.jpg')
    },
    { 
        id: 8, 
        initials: 'QP', 
        name: 'Qpp123', 
        messages: 912, 
        daysAsFriends: 198, 
        streak: 15, 
        mutualFriends: 21,
        avatar: require('../assets/images/profile_picture.jpg')
    },
    { 
        id: 9, 
        initials: 'WP', 
        name: 'Wpp123', 
        messages: 345, 
        daysAsFriends: 56, 
        streak: 0, 
        mutualFriends: 9,
        avatar: require('../assets/images/profile_picture.jpg')
    },
        { 
          id: 10,
          initials: 'RK',
          name: 'RyanK44',
          messages: 892,
          daysAsFriends: 145,
          streak: 6,
          mutualFriends: 14,
          avatar: require('../assets/images/profile_icon.png')
        },
        {
          id: 11,
          initials: 'ML',
          name: 'MikeL88',
          messages: 1102,
          daysAsFriends: 167,
          streak: 11,
          mutualFriends: 16,
          avatar: require('../assets/images/profile-800x800.png')
        },
        {
          id: 12,
          initials: 'SB',
          name: 'SamB22',
          messages: 445,
          daysAsFriends: 78,
          streak: 2,
          mutualFriends: 7,
          avatar: require('../assets/images/profile2-500x500.png')
        },
        {
          id: 13,
          initials: 'JD',
          name: 'JoshD99',
          messages: 678,
          daysAsFriends: 112,
          streak: 8,
          mutualFriends: 11,
          avatar: require('../assets/images/profile3-500x500.png')
        },
        {
          id: 14,
          initials: 'EW',
          name: 'EricW77',
          messages: 334,
          daysAsFriends: 45,
          streak: 0,
          mutualFriends: 5,
          avatar: require('../assets/images/profile_picture.jpg')
        },
        {
          id: 15,
          initials: 'CM',
          name: 'ChrisM11',
          messages: 987,
          daysAsFriends: 89,
          streak: 13,
          mutualFriends: 18,
          avatar: require('../assets/images/profile_icon.png')
        },
        {
          id: 16,
          initials: 'BH',
          name: 'BenH66',
          messages: 556,
          daysAsFriends: 92,
          streak: 5,
          mutualFriends: 10,
          avatar: require('../assets/images/profile-800x800.png')
        },
        {
          id: 17,
          initials: 'NK',
          name: 'NickK33',
          messages: 1208,
          daysAsFriends: 21,
          streak: 14,
          mutualFriends: 20,
          avatar: require('../assets/images/profile2-500x500.png')
        },
        {
          id: 18,
          initials: 'DM',
          name: 'DaveM45',
          messages: 289,
          daysAsFriends: 34,
          streak: 0,
          mutualFriends: 6,
          avatar: require('../assets/images/profile3-500x500.png')
        },
        {
          id: 19,
          initials: 'LS',
          name: 'LukeS91',
          messages: 723,
          daysAsFriends: 123,
          streak: 7,
          mutualFriends: 13,
          avatar: require('../assets/images/profile_picture.jpg')
        },
        {
          id: 20,
          initials: 'AR',
          name: 'AndyR55',
          messages: 445,
          daysAsFriends: 67,
          streak: 3,
          mutualFriends: 8,
          avatar: require('../assets/images/profile_icon.png')
        },
        {
          id: 21,
          initials: 'TM',
          name: 'TomM78',
          messages: 834,
          daysAsFriends: 16,
          streak: 10,
          mutualFriends: 15,
          avatar: require('../assets/images/profile-800x800.png')
        },
        {
          id: 22,
          initials: 'PW',
          name: 'PeteW23',
          messages: 567,
          daysAsFriends: 88,
          streak: 4,
          mutualFriends: 9,
          avatar: require('../assets/images/profile2-500x500.png')
        },
        {
          id: 23,
          initials: 'GK',
          name: 'GregK67',
          messages: 1156,
          daysAsFriends: 18,
          streak: 12,
          mutualFriends: 17,
          avatar: require('../assets/images/profile3-500x500.png')
        },
        {
          id: 24,
          initials: 'RS',
          name: 'RobS89',
          messages: 398,
          daysAsFriends: 56,
          streak: 1,
          mutualFriends: 7,
          avatar: require('../assets/images/profile_picture.jpg')
        },
        {
          id: 25,
          initials: 'KL',
          name: 'KevinL12',
          messages: 678,
          daysAsFriends: 184,
          streak: 6,
          mutualFriends: 12,
          avatar: require('../assets/images/profile_icon.png')
        }
];
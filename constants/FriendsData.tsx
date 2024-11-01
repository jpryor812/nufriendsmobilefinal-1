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
      messages: 1238, 
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
    }
];
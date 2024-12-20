interface AvatarItem {
    id: string;
    image: any;
    defaultUnlocked?: boolean;
    achievement?: string;
    requirementText?: string;
}

interface AvatarPair {
    regularAvatar: {
        id: string;
        image: any;
    };
    premiumAvatar: {
        id: string;
        image: any;
    };
    requirementText: string;
    defaultUnlocked?: boolean;
    messageCount?: number;
}

export const defaultAvatarPairs: AvatarPair[] = [
    {
        regularAvatar: {
            id: 'default_avatar',
            image: require('../assets/avatars/avatar_default.png'),
        },
    premiumAvatar: {
        id: 'solid_yellow',
            image: require('../assets/avatars/solid/solid_avatar_yellow.png'),
        },
        requirementText: 'Default Avatars',
        defaultUnlocked: true
        },
    {
        regularAvatar: {
            id: 'solid_green',
            image: require('../assets/avatars/solid/solid_avatar_green.png'),
        },
        premiumAvatar: {
            id: 'solid_lightgreen',
            image: require('../assets/avatars/solid/solid_avatar_lightgreen.png'),
        },
        requirementText: 'Default Avatars',
        defaultUnlocked: true
    },
    {
        regularAvatar: {
            id: 'solid_orange',
            image: require('../assets/avatars/solid/solid_avatar_orange.png'),
        },
        premiumAvatar: {
            id: 'solid_pink',
            image: require('../assets/avatars/solid/solid_avatar_pink.png'),
        },
        requirementText: 'Default Avatars',
        defaultUnlocked: true
    },
    {
        regularAvatar: {
            id: 'solid_purple',
            image: require('../assets/avatars/solid/solid_avatar_purple.png'),
        },
        premiumAvatar: {
            id: 'solid_red',
            image: require('../assets/avatars/solid/solid_avatar_red.png'),
        },
        requirementText: 'Default Avatars',
        defaultUnlocked: true
    }
];

export const achievementAvatarPairs: AvatarPair[] = [
    {
        regularAvatar: {
            id: 'lightsaber_green',
            image: require('../assets/avatars/lightsaber/Avatar_1.png'),
        },
        premiumAvatar: {
            id: 'lightsaber_blue',
            image: require('../assets/avatars/lightsaber/Avatar_2.png'),
        },
        requirementText: 'Send your first message',
        messageCount: 1
    },
    {
        regularAvatar: {
            id: 'lightsaber_red',
            image: require('../assets/avatars/lightsaber/Avatar_3.png'),
        },
        premiumAvatar: {
            id: 'lightsaber_purple',
            image: require('../assets/avatars/lightsaber/Avatar.png'),
        },
        requirementText: 'Send 5 messages',
        messageCount: 5
    }
];
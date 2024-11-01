interface GenderOption {
    name: string;
    symbol: string;
    imageUrl: string;
}

export const genders: GenderOption[] = [
    {
        name: "Female",
        symbol: "♀",
        imageUrl: "/assets/images/female_icon.png"
    },
    {
        name: "Male",
        symbol: "♂",
        imageUrl: "/assets/images/male_icon.png"
    },
    {
        name: "Non-binary",
        symbol: "⚨",
        imageUrl: "/assets/images/non-binary_icon.png"
    },
    {
        name: "Other",
        symbol: "⚪",
        imageUrl: "/assets/images/face_icon.png"
    },
    {
        name: "Prefer not to say",
        symbol: "–",
        imageUrl: "/assets/images/minus_sign.png"
    },
] as const;

export type GenderType = typeof genders[number]['name'];

// Helper function to get image URL by gender name
export const getGenderImage = (genderName: GenderType): string => {
    return genders.find(g => g.name === genderName)?.imageUrl || '';
};
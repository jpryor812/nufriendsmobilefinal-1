import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import SafeLayout from '@/components/SafeLayout';
import { generateProfileSummaries } from '@/functions/src/generateProfileSummaries';
import { saveSummaries } from '@/functions/src/saveSummaries';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';

//ensure this matches the ProfileSummaries type in types/profile.ts and functions/saveSummaries.ts
interface ProfileSummaries {
    location?: string;
    hobbies?: string;
    music?: string;
    entertainment?: string;
    travel?: string;
    goals?: string;
    isVisible: boolean;
}

const MyProfile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [summaries, setSummaries] = useState<ProfileSummaries>({
        location: '',
        hobbies: '',
        music: '',
        entertainment: '',
        travel: '',
        goals: '',
        isVisible: true
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

    const displayNames = {
        'location': 'Born In',
        'hobbies': 'Hobbies',
        'music': 'Favorite Music',
        'entertainment': 'Favorite Content',
        'travel': 'Best Trip',
        'goals': 'Goals'
    };

    const toggleVisibility = (key: string) => {
        setHiddenItems(prev => {
            const newHidden = new Set(prev);
            if (newHidden.has(key)) {
                newHidden.delete(key);
            } else {
                newHidden.add(key);
            }
            return newHidden;
        });
    };

    const handleSave = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        
        try {
            const saveSummariesFunction = httpsCallable(functions, 'saveSummaries');
            await saveSummariesFunction({ 
                userId, 
                summaries,
                hiddenItems: Array.from(hiddenItems) // Convert Set to Array for serialization
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;
    
            const userDoc = await getDoc(doc(db, 'users', userId));
            const data = userDoc.data();
            setUserData(data);
    
            if (data?.profileSummaries) {
                setSummaries(data.profileSummaries);
            } else if (data?.questionnaire?.onboarding?.responses) {
                const generatedSummaries = await generateProfileSummaries(
                    data.questionnaire.onboarding.responses
                );
                setSummaries(generatedSummaries);
                await updateDoc(doc(db, 'users', userId), {
                    profileSummaries: generatedSummaries
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading profile:', error);
            setIsLoading(false);
        }
    };

    const getGenderIcon = (gender: string) => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return require('../assets/images/male_icon.png');
            case 'female':
                return require('../assets/images/female_icon.png');
            case 'non-binary':
                return require('../assets/images/non-binary_icon.png');
            default:
                return require('../assets/images/face_icon.png');
        }
    };

    if (isLoading) {
        return (
            <SafeLayout>
                <Text>Loading profile...</Text>
            </SafeLayout>
        );
    }

    return (
        <SafeLayout style={styles.container}>
            <View style={styles.profileContainer}>
                <Image 
                    source={require('../assets/images/profile_picture.jpg')} 
                    style={styles.avatar}
                    resizeMode="cover"
                />
                <Text style={styles.name}>{userData?.username}</Text>

                <View style={styles.details}>
                    <View style={styles.detailContainer}>
                        <Image 
                            source={require('../assets/images/Home_icon.png')}
                            style={{ width: 20, height: 20 }} 
                        />
                        <Text style={styles.detailText}>
                            {userData?.demographics?.city}, {userData?.demographics?.state}
                        </Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Image 
                            source={getGenderIcon(userData?.demographics?.gender)}
                            style={{ width: 16, height: 18 }} 
                        />
                        <Text style={styles.detailText}>{userData?.demographics?.gender}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Image 
                            source={require('../assets/images/ph_cake.png')}
                            style={{ width: 18, height: 18 }} 
                        />
                        <Text style={styles.detailText}>{userData?.demographics?.age} years-old</Text>
                    </View>
                </View>
            </View>

                <View style={styles.summaryContainer}>
                <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle}>Profile Summaries</Text>
                    <TouchableOpacity 
                        onPress={() => setIsEditing(true)} // Optionally, you can remove this line if you don't need to track editing state
                        style={styles.editButton}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {Object.entries(summaries)
                        .filter(([key]) => 
                        key !== 'isVisible' && 
                        key !== 'hiddenFields' &&  // Add this condition
                        ['location', 'hobbies', 'music', 'entertainment', 'travel', 'goals'].includes(key) // Only show these fields
                        )
                        .map(([key, value]) => (
                        <View key={key} style={styles.summaryRow}>
                            <View style={styles.labelContainer}>
                                <Text style={[
                                    styles.summaryLabel,
                                    hiddenItems.has(key) && styles.hiddenText
                                ]}>
                                    {displayNames[key as keyof typeof displayNames] || key.charAt(0).toUpperCase() + key.slice(1)}:
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => toggleVisibility(key)}
                                    style={styles.hideButton}
                                >
                                    <Text style={styles.hideButtonText}>
                                        {hiddenItems.has(key) ? 'Show' : 'Hide'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {isEditing ? (
                                <TextInput
                                    style={[
                                        styles.summaryInput,
                                        hiddenItems.has(key) && styles.hiddenText
                                    ]}
                                    value={value}
                                    onChangeText={(text) => setSummaries(prev => ({
                                        ...prev,
                                        [key]: text
                                    }))}
                                    placeholder={`Enter ${key}...`}
                                />
                            ) : (
                                <Text style={[
                                    styles.summaryValue,
                                    hiddenItems.has(key) && styles.hiddenText
                                ]}>
                                    {value}
                                </Text>
                            )}
                        </View>
                    ))}
                    <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
            </View>
        </SafeLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FCFE',
        width: '100%',
        overflow: 'hidden',
    },
    profileContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 60,
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#42ade2',
    },
    details: {
        alignItems: 'center',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 16,
    },
    summaryContainer: {
        backgroundColor: '#fff',
        marginVertical: 16,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#42ade2',
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    editButtonText: {
        color: '#42ade2',
        fontWeight: '600',
    },
    summaryRow: {
        marginBottom: 16,
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        color: '#333',
    },
    summaryInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        marginTop: 4,
    },
    hideButton: {
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
    },
    hideButtonText: {
        color: '#42ade2',
        fontSize: 12,
        fontWeight: '600',
    },
    hiddenText: {
        color: '#ccc',
    },
    saveButton: {
        backgroundColor: '#42ade2',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MyProfile;
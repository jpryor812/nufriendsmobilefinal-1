// app/subscription.tsx
import React, {useState} from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import MonthlySubscriptionHeader from '@/components/MonthlySubscriptionHeader';
import PricingToggle from '@/components/PricingToggle';
import FeatureContainer from '@/components/FeatureContainer';
import PremiumPrice from '@/components/PremiumPrice';
import UpgradeToPremiumButton from '@/components/UpgradeToPremiumButton';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../assets/Colors'; // Ensure this path is correct
import { useRouter } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import PremiumToggle from '@/components/PremiumToggle';

const UpgradeToPremium = () => {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [premiumType, setpremiumType] = useState<'premium' | 'social-butterfly'>('premium');

    const features = [
  {
      icon: require('@/assets/images/Yu_excited_no_speech.png'),
      isImage: true,
      highlight: 'Use Yu',
      primary: premiumType === 'premium' ? '100' : '200',
      text: 'times per week',
      subtext: premiumType === 'premium' ? 
      "5x more than the free plan." : 
      "10x more than the free plan."
  },
  {
      icon: '🫂',
      isImage: false,
      highlight: 'Search for up to',
      primary: premiumType === 'premium' ? '2' : '4', 
      text: `new friends per day`,
      subtext: "Don't wait to get matched. Find friends when you want!" 
  },
      {
        icon: '💰', 
        isImage: false,
        highlight: 'Unlock',
        primary: 'premium',
        text: 'accessories',
        primaryTwo: '',
        textTwo: '',
        subtext: 'Twice the items twice the style'
      },
      {
        icon: '⚡️', 
        isImage: false,
        highlight: 'Get',
        primary: premiumType === 'premium' 
          ? (billingPeriod === 'monthly' ? '2' : '4') 
          : (billingPeriod === 'monthly' ? '3' : '6'),
        text: 'new friends',
        primaryTwo: 'instantly',
        textTwo: '',
        subtext: ''
      },
    // Add more features here if needed
  ];

  return (
    <SafeLayout style={styles.container}>  
          <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>
      <Image 
        source={require('../assets/images/yu_progress_bar.png')} 
        style={styles.yu}
      />
      <PremiumToggle
        premiumType={premiumType}
        setpremiumType={setpremiumType}
      />
      <Text style={styles.header}>Never Feel Alone Again</Text>
      <Text style={styles.subHeader}>What You Get With Premium:</Text>
    </View>
      <PricingToggle 
              billingPeriod={billingPeriod}
              setBillingPeriod={setBillingPeriod}
            />
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureContainer
            key={index}
            icon={feature.icon}
            isImage={feature.isImage}
            highlight={feature.highlight}
            primary={feature.primary}
            text={feature.text}
            primaryTwo={feature.primaryTwo}
            textTwo={feature.textTwo}
            subtext={feature.subtext}
          />
        ))}
      </View>
    <PremiumPrice 
        billingPeriod={billingPeriod} 
        premiumType={premiumType}
    />
      <UpgradeToPremiumButton />
    </SafeLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  featuresContainer: {
    marginTop: 10, // Add space after the pricing toggle
  },
    headerContainer: {
    marginBottom: 16,
},
backButton: {
  marginLeft: 10,
  padding: 10, // Added padding for better touch target
},
yu: {
  width: 60,
  height: 60,
  alignSelf: 'center',
  marginTop: -32,
},
header: {
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'center',
  marginTop: 10,
  marginBottom: 10,
},
  subHeader: {
      fontSize: 16,
      textAlign: 'center',
      marginHorizontal: 20,
  },
});

export default UpgradeToPremium;
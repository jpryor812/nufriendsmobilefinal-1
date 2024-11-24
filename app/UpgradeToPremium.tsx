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

const UpgradeToPremium = () => {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');


    const features = [
    {
      icon: require('@/assets/images/Yu_excited_no_speech.png'), 
      isImage: true,
      highlight: 'Use Yu',
      primary: '200',
      text: 'times per week',
      primaryTwo: '',
      textTwo: '',
      subtext: '10x more usage than free plan'
    },
    {
        icon: '🫂', 
        isImage: false, 
        highlight: '',
        primary: 'Search',
        text: 'for up to',
        primaryTwo: '4',
        textTwo: 'new friends per day',
        subtext: "Free users can't search for friends; they must wait to be randomly matched."
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
        primary: billingPeriod === 'monthly' ? 'two' : 'five',
        text: billingPeriod === 'monthly' ? 'new friends' : 'new friends',
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
      <PremiumPrice billingPeriod={billingPeriod} />
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
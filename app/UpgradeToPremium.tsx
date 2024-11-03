// app/subscription.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import MonthlySubscriptionHeader from '@/components/MonthlySubscriptionHeader';
import PricingToggle from '@/components/PricingToggle';
import FeatureContainer from '@/components/FeatureContainer';
import PremiumPrice from '@/components/PremiumPrice';
import UpgradeToPremiumButton from '@/components/UpgradeToPremiumButton';

const UpgradeToPremium = () => {
  const features = [
    {
      icon: require('@/assets/images/Yu_excited_no_speech.png'), 
      isImage: true,
      highlight: 'Use Yu',
      primary: '500',
      text: 'times per week',
      primaryTwo: '',
      textTwo: '',
      subtext: '20x more usage than free plan'
    },
    {
        icon: '🫂', 
        isImage: false,
        highlight: 'Find',
        primary: '4',
        text: 'new friends per day',
        primaryTwo: '',
        textTwo: '',
        subtext: '90 more friends per month than free plan'
      },
      {
        icon: '🏃', 
        isImage: false,
        highlight: '',
        primary: 'Skip',
        text: 'the line when finding new friends',
        primaryTwo: '',
        textTwo: '',
        subtext: '4-12x faster friend matching than free plan' 
      },
      {
        icon: '💰', 
        isImage: false,
        highlight: 'Unlock',
        primary: 'premium',
        text: 'accessories and',
        primaryTwo: '2x',
        textTwo: 'coin boosts',
        subtext: ''
      },
      {
        icon: '⚡️', 
        isImage: false,
        highlight: 'Get',
        primary: 'one',
        text: 'new friend',
        primaryTwo: 'instantly',
        textTwo: '',
        subtext: ''
      },
    // Add more features here if needed
  ];

  return (
    <SafeAreaView style={styles.container}>  
      <MonthlySubscriptionHeader />
      <PricingToggle />
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
      <PremiumPrice />
      <UpgradeToPremiumButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FCFE',
  },
  featuresContainer: {
    marginTop: 20, // Add space after the pricing toggle
  },
  header: {
    marginBottom: 10,
  },
});

export default UpgradeToPremium;
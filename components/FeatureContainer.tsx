import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface FeatureProps {
    icon: string | ImageSourcePropType;
    isImage?: boolean;
    highlight?: string; // Made optional
    primary: string;
    text: string;
    primaryTwo?: string; // Made optional
    textTwo?: string; // Made optional
    subtext?: string; // Made optional
  }
  
  const FeatureContainer: React.FC<FeatureProps> = ({
    icon,
    isImage = false,
    highlight,
    primary,
    text,
    primaryTwo,
    textTwo,
    subtext
  }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isImage ? (
          <Image 
            source={icon as ImageSourcePropType}
            style={styles.iconImage}
          />
        ) : (
          <Text style={styles.icon}>{icon as string}</Text>
        )}
      </View>
      
      <View style={styles.textContainer}>
        <View style={styles.mainTextRow}>
          {highlight && ( // Only render if highlight exists
            <Text style={styles.highlight}>{highlight}</Text>
          )}
          <Text style={styles.primary}>{primary}</Text>
          <Text style={styles.text}>{text}</Text>
          {primaryTwo && ( // Only render if primaryTwo exists
            <Text style={styles.primaryTwo}>{primaryTwo}</Text>
          )}
          {textTwo && ( // Only render if textTwo exists
            <Text style={styles.textTwo}>{textTwo}</Text>
          )}
        </View>
        {subtext && ( // Only render if subtext exists
          <Text style={styles.subtext}>{subtext}</Text>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF', // light blue background
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  iconImage: {
    width: 32, // Adjust size as needed
    height: 32, // Adjust size as needed
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  mainTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 4,
  },
  highlight: {
    color: '#4B5563', // blue text
    fontSize: 14,
    fontWeight: '700',
  },
  primary: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2a98fd',
  },
  primaryTwo: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2a98fd',
  },
  text: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '700',
  },
  textTwo: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '700',
  },
  subtext: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
});


export default FeatureContainer;
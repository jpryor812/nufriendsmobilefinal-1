import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface FeatureProps {
  icon: string | ImageSourcePropType; // Can be emoji string or image source
  isImage?: boolean; // Flag to determine if icon is an image
  highlight: string;
  primary: string;
  text: string;
  primaryTwo: string;
  textTwo: string;
  subtext: string;
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
          <Text style={styles.highlight}>{highlight}</Text>
          <Text style={styles.primary}>{primary}</Text>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.primaryTwo}>{primaryTwo}</Text>
          <Text style={styles.textTwo}>{textTwo}</Text>
        </View>
        <Text style={styles.subtext}>{subtext}</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF', // light blue background
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  iconImage: {
    width: 38, // Adjust size as needed
    height: 38, // Adjust size as needed
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
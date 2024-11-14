import React, { ReactNode } from 'react';
import { ScrollView, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScrollSafeLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  hasTabBar?: boolean; // Add this prop
}

export default function ScrollSafeLayout({ 
  children, 
  style, 
  contentContainerStyle,
  hasTabBar = false // Default to false
}: ScrollSafeLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 0 : insets.top
        },
        style
      ]}
      contentContainerStyle={[
        {
          // Only add bottom padding if there's no tab bar
          paddingBottom: hasTabBar ? 0 : (
            Platform.OS === 'android' ? Math.max(insets.bottom, 20) : insets.bottom
          )
        }, 
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={false} // Optional: hide scroll indicator
    >
      {children}
    </ScrollView>
  );
}
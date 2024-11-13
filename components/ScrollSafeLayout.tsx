import React, { ReactNode } from 'react';
import { ScrollView, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScrollSafeLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export default function ScrollSafeLayout({ 
  children, 
  style, 
  contentContainerStyle 
}: ScrollSafeLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={[
        {
          flex: 1,
          // Only apply top padding if on iOS to maintain your original layout
          paddingTop: Platform.OS === 'ios' ? 0 : insets.top
        },
        style
      ]}
      contentContainerStyle={[
        {
          // Different bottom padding for iOS and Android
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 20) : 0
        }, 
        contentContainerStyle
      ]}
    >
      {children}
    </ScrollView>
  );
}
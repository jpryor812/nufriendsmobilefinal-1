import React, { ReactNode } from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
  hasTabBar?: boolean; // Add this prop to handle tab bar screens
}

export default function SafeLayout({ 
  children, 
  style,
  hasTabBar = false // Default to false
}: SafeLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      {
        flex: 1,
        // Keep top padding
        paddingTop: insets.top,
        // Only add bottom padding if there's no tab bar
        paddingBottom: hasTabBar ? 0 : (Platform.OS === 'android' ? Math.max(insets.bottom, 20) : insets.bottom)
      },
      style
    ]}>
      {children}
    </View>
  );
}
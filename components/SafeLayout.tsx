import React, { ReactNode } from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function SafeLayout({ children, style }: SafeLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      {
        flex: 1,
        // Always apply top padding for iOS and Android
        paddingTop: insets.top,
        // Only add extra bottom padding for Android
        paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 20) : insets.bottom
      },
      style
    ]}>
      {children}
    </View>
  );
}
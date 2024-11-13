// FooterNavigation.tsx
import React from 'react';
import { Platform } from 'react-native';
import FooterNavigationIOS from './FooterNavigationIOS';
import FooterNavigationAndroid from './FooterNavigationAndroid';

const FooterNavigation = () => {
  return Platform.OS === 'ios' ? <FooterNavigationIOS /> : <FooterNavigationAndroid />;
};

export default FooterNavigation;
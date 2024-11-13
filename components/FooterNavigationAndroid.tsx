// FooterNavigationAndroid.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link, usePathname } from "expo-router";

const FooterNavigationAndroid = () => {
  const currentPath = usePathname();

  return (
    <View style={styles.footer}>
      <View style={styles.navItem}>
        <Link href={"/HomePage"} style={styles.footerItem}>
          <Image 
            source={require('../assets/images/house_emoji.png')} 
            style={styles.icon} 
          />
        </Link>
        <View style={[
          styles.indicatorContainer,
          currentPath === "/HomePage" && styles.activeIndicatorContainer
        ]}>
          <View style={[
            styles.indicator,
            currentPath === "/HomePage" && styles.activeIndicator
          ]} />
        </View>
      </View>

      <View style={styles.navItem}>
        <Link href={"/ProfilePage"} style={styles.footerItem}>
          <Image 
            source={require('../assets/images/profile_picture.jpg')} 
            style={styles.profileicon} 
          />
        </Link>
        <View style={[
          styles.indicatorContainer,
          currentPath === "/ProfilePage" && styles.activeIndicatorContainer
        ]}>
          <View style={[
            styles.indicator,
            currentPath === "/ProfilePage" && styles.activeIndicator
          ]} />
        </View>
      </View>

      <View style={styles.navItem}>
        <Link href={"/FriendPage"} style={styles.footerItem}>
          <Image 
            source={require('../assets/images/hand_progress_bar.png')} 
            style={styles.icon} 
          />
        </Link>
        <View style={[
          styles.indicatorContainer,
          currentPath === "/FriendPage" && styles.activeIndicatorContainer
        ]}>
          <View style={[
            styles.indicator,
            currentPath === "/FriendPage" && styles.activeIndicator
          ]} />
        </View>
      </View>

      <View style={styles.navItem}>
        <Link href={"/ChatRoomYu"} style={styles.footerItem}>
          <Image 
            source={require('../assets/images/yu_progress_bar.png')} 
            style={styles.icon} 
          />
        </Link>
        <View style={[
          styles.indicatorContainer,
          currentPath === "/ChatRoomYu" && styles.activeIndicatorContainer
        ]}>
          <View style={[
            styles.indicator,
            currentPath === "/ChatRoomYu" && styles.activeIndicator
          ]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(235, 247, 254, 0.8)',
    paddingVertical: 12,
    height: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  icon: {
    width: 40,  // Larger size for Android
    height: 40,
    resizeMode: 'contain',
  },
  profileicon: {
    width: 40,  // Larger size for Android
    height: 40,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  indicatorContainer: {
    width: 30,
    height: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  activeIndicatorContainer: {
    elevation: 2,
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
  },
  indicator: {
    width: '100%',
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#F0FCFE',
  },
  activeIndicator: {
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
  },
});

export default FooterNavigationAndroid;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link, usePathname } from "expo-router";

const FooterNavigation = () => {
  const currentPath = usePathname();

  return (
    <View style={styles.footer}>
      <View style={styles.navItem}>
        <Link href={"/HomePage"} style={styles.footerItem}>
          <Image source={require('../assets/images/house_emoji.png')} style={styles.icon} />
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
          <Image source={require('../assets/images/profile_picture.jpg')} style={styles.profileicon} />
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
          <Image source={require('../assets/images/hand_progress_bar.png')} style={styles.icon} />
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
          <Image source={require('../assets/images/yu_progress_bar.png')} style={styles.Yuicon} />
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
    borderTopWidth: 2,
    borderTopColor: '#EBF7FE',
  },
  navItem: {
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 1,
  },
  profileicon: {
    width: 30,
    height: 30,
    marginBottom: 1,
    borderRadius: 50,
  },
  Yuicon: {
    width: 34,
    height: 34,
    marginBottom: 1,
  },
  indicatorContainer: {
    width: 30, // Match icon width
    height: 3,  // Height of the line
    marginTop: 5,
    shadowColor: 'transparent', // No shadow when inactive
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  activeIndicatorContainer: {
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // for Android
  },
  indicator: {
    width: '100%',
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#F0FCFE', // Same as background when inactive
  },
  activeIndicator: {
    backgroundColor: 'rgba(33, 150, 243, 0.7)', // Softer blue with opacity
  },
});

export default FooterNavigation;
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Link, usePathname } from "expo-router";

const FooterNavigationAndroid = () => {
  const currentPath = usePathname();

  return (
    <View style={styles.footer}>
      <View style={styles.navItem}>
        <Link href={"/HomePage"} style={styles.footerItem}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/images/house_emoji.png')} 
              style={styles.icon} 
            />
          </View>
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
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/images/profile_picture.jpg')} 
              style={styles.profileicon} 
            />
          </View>
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
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/images/hand_progress_bar.png')} 
              style={styles.icon} 
            />
          </View>
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
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/images/yu_progress_bar.png')} 
              style={styles.icon} 
            />
          </View>
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

const ICON_SIZE = 36; // Base icon size
const styles = StyleSheet.create({
footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Changed from space-around to space-evenly
    alignItems: 'center',
    backgroundColor: '#F0FCFE',
    borderTopWidth: 2,
    borderTopColor: '#e9e9e9',
    paddingBottom: 16,
    paddingTop: 18,
    height: 60,
    },
    navItem: {
    alignItems: 'center', // Centers children horizontally
    justifyContent: 'center',
    height: '100%',
    width: '25%', // Each item takes exactly 1/4 of the space
    },
    footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    },
    iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: 'contain',
  },
  profileicon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    resizeMode: 'cover', // Changed from 'contain' for profile picture
  },
  indicatorContainer: {
    width: 30,
    height: 3,
    marginTop: 20,
    marginBottom: -10,
  },
  activeIndicatorContainer: {
    elevation: 1,
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
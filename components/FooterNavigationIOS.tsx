import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Link, usePathname } from "expo-router";

const FooterNavigationIOS = () => {
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
    borderTopWidth: Platform.select({
      ios: 2,
      android: 2,
    }),
    borderTopColor: Platform.select({
      ios: '#EBF7FE',
      android: 'rgba(235, 247, 254, 0.8)', // Slightly more transparent for Android
    }),
    backgroundColor: '#F0FCFE',
    ...Platform.select({
      android: {
        paddingBottom: 8, // Add some padding at the bottom for Android
        paddingTop: 4,    // Slightly less padding at top for Android
      }
    }),
  },
  navItem: {
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: Platform.select({
      ios: -5,
      android: 0, // Remove negative margin for Android
    }),
  },
  profileicon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginBottom: Platform.select({
      ios: -5,
      android: 0, // Remove negative margin for Android
    }),
  },
  Yuicon: {
    width: 34,
    height: 34,
    marginBottom: Platform.select({
      ios: -5,
      android: 0, // Remove negative margin for Android
    }),
  },
  indicatorContainer: {
    width: 30,
    height: 3,
    marginTop: 5,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    ...Platform.select({
      android: {
        elevation: 0,
        overflow: 'hidden', // Prevent shadow bleeding on Android
      }
    }),
  },
  activeIndicatorContainer: {
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    ...Platform.select({
      android: {
        elevation: 2,
        backgroundColor: 'rgba(33, 150, 243, 0.7)', // Match the indicator color
      }
    }),
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

export default FooterNavigationIOS;
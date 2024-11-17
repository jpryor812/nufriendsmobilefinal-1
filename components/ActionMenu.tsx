import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/Colors';

const ActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const menuItems = [
    { icon: 'mic', label: 'Voice' },
    { icon: 'camera', label: 'Camera' },
    { icon: 'images', label: 'Gallery' },
  ];

  const toggleMenu = () => {
    console.log('Toggle menu pressed, current isOpen:', isOpen);
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start(() => {
      console.log('Animation completed');
    });
    
    setIsOpen(!isOpen);
  };

  // Add layout measurements to ensure proper positioning
  const [menuLayout, setMenuLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <View 
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setMenuLayout({ width, height });
      }}
    >
      {/* Menu Items */}
      <View style={[styles.menuContainer, { zIndex: 1 }]}>
        {menuItems.map((item, index) => {
          const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -64 * (index + 1)]
          });

          const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1]
          });

          return (
            <Animated.View
              key={item.icon}
              style={[
                styles.menuItem,
                {
                  transform: [{ translateY }],
                  opacity,
                  position: 'absolute',
                  bottom: menuLayout.height,
                  right: 0,
                  zIndex: 2
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: Colors.background }]}
                onPress={() => {
                  console.log(`${item.label} pressed`);
                  toggleMenu();
                }}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Toggle Button */}
      <TouchableOpacity 
        onPress={toggleMenu}
        style={styles.toggleButton}
      >
        <Animated.View
          style={{
            transform: [{
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg']
              })
            }]
          }}
        >
          <Ionicons name="add" color={Colors.primary} size={22} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 40,  // Add minimum height to ensure layout
    minWidth: 40,   // Add minimum width to ensure layout
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  menuButton: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 8,
    marginRight: 0,  // Removed right margin since we don't have labels
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toggleButton: {
    padding: 8,  // Add padding to make button more touchable
    zIndex: 3,   // Ensure toggle button stays on top
  }
});

export default ActionMenu;
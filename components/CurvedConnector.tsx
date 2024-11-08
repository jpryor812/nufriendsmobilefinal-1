import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CurvedConnectorProps {
  direction?: 'left' | 'right';
}

const CurvedConnector: React.FC<CurvedConnectorProps> = ({ direction = 'right' }) => (
  <View style={[
    styles.connectorContainer,
    direction === 'left' ? { transform: [{ scaleX: -1 }] } : {}
  ]}>
    <View style={styles.curvedLine} />
  </View>
);

const styles = StyleSheet.create({
  connectorContainer: {
    height: 40,
    width: 60,
    marginVertical: -5,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  curvedLine: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: '-45deg' }, { translateX: -15 }, { translateY: -15 }],
  }
});

export default CurvedConnector;
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  achievementContainer: {
    width:90,
    height: 95,
    borderWidth: 7,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdfdfd',
    marginBottom: 16,
  },
  achievementSuccess: {
    borderColor: '#ffde66',
  },
  achievementLocked: {
    borderColor: '#dedede',
  },
  trophyIcon: {
    position: 'absolute',
    top: -15,
    right: -10,
    width: 25,
    height: 25,
  },
});

export default styles;
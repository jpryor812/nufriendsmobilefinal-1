import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import SafeLayout from './SafeLayout';

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <SafeLayout style={styles.progress_bar_container}>
      <View style={styles.progress_bar_image_container}>
        <Image
          source={require('../assets/images/yu_progress_bar.png')}
          style={styles.yu_progress_bar}
        />
        <Image
          source={require('../assets/images/mail_progress_bar.png')}
          style={styles.mail_progress_bar}
        />
        <Image
          source={require('../assets/images/yu_progress_bar.png')}
          style={styles.yu_progress_bar}
        />
        <Image
          source={require('../assets/images/hand_progress_bar.png')}
          style={styles.hand_progress_bar}
        />
        <Image
          source={require('../assets/images/Yu_excited_no_speech.png')}
          style={styles.yu_progress_bar}
        />
      </View>
      <View style={styles.progress_bar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </SafeLayout>   
  );
};


const styles = StyleSheet.create({

  progress_bar_container: {
    alignItems: 'center',
    width: '90%',
    paddingTop: 10,  // Changed from marginTop to paddingTop
    alignSelf: 'center',  // Center the container horizontally
  },
  progress_bar: {
    height: 14,
    width: '90%',
    backgroundColor: '#FeFeFe',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'flex-start',
    borderColor: '#42ade2',
    borderWidth: 1,
    marginBottom: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#42ade2',
    borderRadius: 10,
  },
  progress_bar_image_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'
  },
  yu_progress_bar: {
    width: 20,
    height: 20,  // Added fixed height
    resizeMode: 'contain',
  },
  mail_progress_bar: {
    width: 18,
    height: 18,  // Added fixed height
    resizeMode: 'contain',
    marginRight: -40,
    marginLeft: -10
  },
  hand_progress_bar: {
    width: 20,
    height: 20,  // Added fixed height
    resizeMode: 'contain',
    marginLeft: 50,
  },
});

export default ProgressBar;
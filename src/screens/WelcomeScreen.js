// WelcomeScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

// Use SafeAreaView from safe-area-context (fix deprecation warning)
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // Navigate to LanguageSelection
  const handleNavigate = () => {
    navigation.navigate('LanguageSelection');
  };

  // Auto-navigate after 5 seconds when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        handleNavigate();
      }, 5000);

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchableContainer}
        onPress={handleNavigate}
      >
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/Alpha-Aid-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeText}>Welcome</Text>
                        <Text style={styles.copyrightText}>@copyright 2025 Alpha-aid Healthcare Pvt. Ltd</Text>
          </View>

          {/* Home Indicator */}
          <View style={styles.homeIndicator} />

        </ScrollView>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  touchableContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 10,
    opacity: 0.8,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 270,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#444E80',
    textAlign: 'center',
    fontFamily: 'Raleway',
    letterSpacing: 0.5,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 32,
    width: 190,
    height: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  copyrightText: {
    fontSize: 12,
    color: '#6b6b6b',
    fontFamily: 'Poppins',
    marginBottom: 12,
    textAlign: 'center',
  },
});

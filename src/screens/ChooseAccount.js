// ChooseAccount.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export default function ChooseAccount({ navigation, route }) {
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const language = i18n.language || 'en';

  const handleAccountSelection = (accountType) => {
    setSelectedAccountType(accountType);
  };

  const handleContinue = () => {
    if (!selectedAccountType) return;
    console.log('Attempting to navigate with type:', selectedAccountType); // Add this line

    if (selectedAccountType === 'provider') {
      navigation.navigate('ProviderExpertiseScreen', {
        language,
        accountType: 'provider',
      });
    } else if (selectedAccountType === 'user') {
      navigation.navigate('UserSignUp', {
        language,
        accountType: 'user',
      });
    }
  };


  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.mainContent}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {/* TOP LOGO */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/AccountIcon_bg.png')}
              style={styles.mainLogo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('chooseYourAccount')}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{t('letsGetStarted')}</Text>

          {/* Description */}
          <Text style={styles.description}>
            {t('tellUsWhoYouAre')}
          </Text>

          <View style={styles.divider} />

          {/* Cards */}
          <View style={styles.cardsContainer}>

            {/* Provider Card */}
            <TouchableOpacity
              style={[
                styles.accountCard,
                selectedAccountType === 'provider' && styles.accountCardSelected,
              ]}
              onPress={() => handleAccountSelection('provider')}
            >
              <View style={styles.iconWrapper}>
                <Image
                  source={require('../../assets/AccountIcon_provider.png')}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.cardTitle}>{t('iAmProvider')}</Text>
              <Text style={styles.cardDescription}>
                {t('manageServices')}
              </Text>
            </TouchableOpacity>

            {/* User Card */}
            <TouchableOpacity
              style={[
                styles.accountCard,
                selectedAccountType === 'user' && styles.accountCardSelected,
              ]}
              onPress={() => handleAccountSelection('user')}
            >
              <View style={styles.iconWrapper}>
                <Image
                  source={require('../../assets/AccountIcon_user.png')}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.cardTitle}>{t('iAmUser')}</Text>
              <Text style={styles.cardDescription}>
                {t('exploreBookProviders')}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAccountType && styles.continueButtonDisabled,
          ]}
          disabled={!selectedAccountType}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {t('continue')} <Text style={styles.continueArrow}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
    justifyContent: 'space-between',
  },

  mainContent: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  header: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  timeText: { fontSize: 10, fontWeight: '600' },
  iconGroup: { flexDirection: 'row', gap: 8 },
  icon: { fontSize: 10, opacity: 0.8 },

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 50,
  },
  backIcon: { fontSize: 26, fontWeight: 'bold', color: '#000' },

  // Top Illustration
  illustrationContainer: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 12,
  },
  mainLogo: { width: '100%', height: '100%' },

  // Titles
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },

  // Cards
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 20,
  },
  accountCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  accountCardSelected: {
    borderColor: '#F283AF',
    borderWidth: 2,
    backgroundColor: '#FFF8FC',
  },

  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: { width: 50, height: 50 },

  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Continue Button
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  continueButtonDisabled: { opacity: 0.2 },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  continueArrow: { fontSize: 18 },

  homeIndicator: {
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
    marginBottom: 8,
  },
});

import React, { useState, useEffect } from 'react';
import log from '../../utils/logger';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const expertiseOptions = [
  { id: '1', key: 'medicalProfessionals' },
  { id: '2', key: 'wellnessSupport' },
  { id: '3', key: 'homeCare' },
  { id: '4', key: 'counselors' },
  { id: '5', key: 'fitnessInstructors' },
];

export default function ProviderExpertiseScreen({ navigation, route }) {
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const language = i18n.language || 'en';
  const accountType = route?.params?.accountType || 'provider';

  const isFormValid = selectedExpertise.length > 0;

  const toggleExpertise = (expertiseId) => {
    setSelectedExpertise((prevSelected) => {
      if (prevSelected.includes(expertiseId)) {
        return prevSelected.filter((id) => id !== expertiseId);
      } else {
        return [...prevSelected, expertiseId];
      }
    });
  };

  const handleContinue = () => {
    if (isFormValid) {
      // Navigate to next screen (e.g., Profile Setup or Additional Info)
      navigation.navigate('ProviderSignUp', {
        language,
        accountType,
        expertise: selectedExpertise,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{t('selectYourExpertiseSubtitle') || 'Select your expertise'}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Expertise Options */}
        <View style={styles.optionsContainer}>
          {expertiseOptions.map((option) => {
            const isSelected = selectedExpertise.includes(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => toggleExpertise(option.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {/* USE THE TRANSLATION FUNCTION HERE */}
                  {t(option.key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid}
          activeOpacity={isFormValid ? 0.8 : 1}
        >
          <Text style={styles.continueButtonText}>
            {t('continue')} <Text style={styles.arrow}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 12,
    marginTop: 32,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    alignItems: 'flex-start',
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: '#0067A1',
    backgroundColor: '#FFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    fontFamily: 'Raleway',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 30,
  },
  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#F283AF',
    opacity: 0.2,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Raleway',
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
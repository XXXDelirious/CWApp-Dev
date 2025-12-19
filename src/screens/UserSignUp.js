//UserSignUp.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';

export default function UserSignUpScreen({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { setConfirmation } = useContext(AuthContext);

  const language = i18n.language || 'en';
  const accountType = route?.params?.accountType || 'user';

  const isFormValid = phoneNumber.length >= 10 && termsAccepted;

  const handleSendOTP = async () => {
    if (!isFormValid) return;

    setLoading(true);

    const fullPhone = `+91${phoneNumber}`;
    try {
      const confirmation = await auth().signInWithPhoneNumber(fullPhone);

      // Store confirmation in context instead of navigation params
      setConfirmation(confirmation);

      setLoading(false);

      navigation.navigate('OTPVerification', {
        language,
        accountType,
        phoneNumber: fullPhone,
      });
    } catch (error) {
      setLoading(false);
      console.log('OTP Error:', error);

      Alert.alert(
        t('otpFailed'),
        error.message || t('failedToSendOTP')
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>{t('signUpLogIn')}</Text>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder={t('enterPhoneNumber')}
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={styles.infoText}>
            {t('youWillReceiveOTP')}
          </Text>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              {termsAccepted ? (
                <View style={styles.checkboxChecked}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : (
                <View style={styles.checkboxUnchecked} />
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              {t('iAgreeToTerms')}{' '}
              <Text style={styles.termsLink}>{t('termsOfService')}</Text>
              {' '}{t('and')}{' '}
              <Text style={styles.termsLink}>{t('privacyPolicy')}</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Send OTP Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.sendOTPButton,
            (!isFormValid || loading) && styles.sendOTPButtonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={!isFormValid || loading}
        >
          <Text style={styles.sendOTPButtonText}>
            {loading ? t('sending') : t('sendOTP')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

// 👉 STYLES BELOW (unchanged from your file)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F9' },
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
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  countryCode: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  divider: { width: 1, height: 20, backgroundColor: '#ccc', marginRight: 8 },
  input: { flex: 1, fontSize: 12 },
  infoText: { textAlign: 'center', marginBottom: 24 },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: { width: 20, height: 20, marginRight: 8 },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    backgroundColor: '#F283AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: '#fff', fontSize: 12 },
  termsText: { flex: 1, fontSize: 14 },
  termsLink: { textDecorationLine: 'underline' },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  sendOTPButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
  },
  sendOTPButtonDisabled: { opacity: 0.3 },
  sendOTPButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 190,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

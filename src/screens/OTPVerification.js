// OTPVerification.js

import React, { useState, useRef, useEffect, useContext } from 'react';
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

export default function OTPVerificationScreen({ navigation, route }) {

  // Get confirmation from context instead of route params
  const { confirmation } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
  const insets = useSafeAreaInsets();

  const language = i18n.language || 'en';
  const accountType = route?.params?.accountType || 'user';
  const phoneNumber = route?.params?.phoneNumber || '+91';

  // Create refs for 6 inputs
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const isFormValid = otp.every((digit) => digit !== '');

  const handleOTPChange = (value, index) => {
    const newValue = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    if (newValue !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    if (!confirmation) {
      Alert.alert(t('error'), t('missingConfirmation'));
      return;
    }

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert(t('invalidOTP'), t('pleaseEnterOTP'));
      return;
    }

    try {
      console.log("Verifying OTP:", otpCode);
      await confirmation.confirm(otpCode);

      Alert.alert(t('success'), t('otpVerifiedSuccessfully'));

      // Navigate to next screen
      navigation.replace("HomeScreen", {
        language,
        accountType,
        phoneNumber,
      });

    } catch (error) {
      console.log(t('otpVerificationError'), error);
      Alert.alert(t('otpFailed'), error.message || t('invalidOTPTryAgain'));
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs[0].current?.focus();
    Alert.alert(t('otpSent'), t('newOTPSentToNumber'));
  };

  useEffect(() => {
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 500);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('otpVerification')}</Text>

          <Text style={styles.infoText}>
            {t('enterOTPSentTo')} <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>

          {/* Resend */}
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendLink}>{t('resendOTP')}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.verifyButton, !isFormValid && styles.verifyButtonDisabled]}
          disabled={!isFormValid}
          onPress={handleVerify}
        >
          <Text style={styles.verifyButtonText}>{t('verify')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F9' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 200,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
    fontFamily: 'Raleway',
  },
  infoText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  phoneNumber: { fontWeight: '700' },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  resendLink: {
    color: '#0067A1',
    fontWeight: '700',
    marginTop: 10,
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 24,
  },
  verifyButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    borderRadius: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: '#F283AF',
    opacity: 0.4,
  },
  verifyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
  },
});

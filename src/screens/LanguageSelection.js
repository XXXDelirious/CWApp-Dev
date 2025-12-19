import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी (Hindi)' },
  { id: 'bn', name: 'বাংলা (Bengali)' },
  { id: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { id: 'ta', name: 'தமிழ் (Tamil)' },
  { id: 'te', name: 'తెలుగు (Telugu)' },
  { id: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { id: 'mr', name: 'मराठी (Marathi)' },
];

export default function LanguageSelection({ navigation }) {
  const insets = useSafeAreaInsets();
  const { i18n, t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [visible, setVisible] = useState(false);

  // Animation value (MUST be outside render conditions)
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      translateY.setValue(300);
    }
  }, [visible, translateY]);

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate('ChooseAccount', {
        language: selectedLanguage.id,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/languageSelectionLogo.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        {/* Title */}
        <Text style={styles.title}>Choose Your Language</Text>
        
        {/* Dropdown Button */}
        <TouchableOpacity
          style={styles.dropdownButton}
          activeOpacity={0.8}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedLanguage ? selectedLanguage.name : t('selectLanguage')}
          </Text>
          <Text style={styles.arrow}>⌄</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLanguage && styles.disabledButton,
          ]}
          disabled={!selectedLanguage}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            {t('continue')} <Text style={styles.arrowRight}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== MODAL DROPDOWN ===== */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalRoot}>
          {/* BACKDROP */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setVisible(false)}
          />

          {/* DROPDOWN */}
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY }] },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              {languages.map((lang) => {
                const selected = selectedLanguage?.id === lang.id;

                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[
                      styles.item,
                      selected && styles.itemSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedLanguage(lang);
                      // Change language immediately when selected
                      i18n.changeLanguage(lang.id);
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selected && styles.itemTextSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 140,
  },

  illustration: {
    width: 280,
    height: 200,
    marginTop: 40,
    marginBottom: 40,
  },

  dropdownButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  arrow: {
    fontSize: 14,
    fontWeight: '700',
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },

  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.3,
  },

  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  arrowRight: {
    fontSize: 20,
  },

  /* ===== MODAL ===== */

  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: 320,
    paddingVertical: 8,
    elevation: 10, // ANDROID
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  itemSelected: {
    backgroundColor: '#FFE6EF',
  },

  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  itemTextSelected: {
    color: '#F283AF',
    fontWeight: '800',
  },
});

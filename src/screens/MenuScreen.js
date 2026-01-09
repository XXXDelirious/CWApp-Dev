import React, { useEffect, useCallback } from 'react';
import log from '../../utils/logger';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MenuScreen() {

  const navigation = useNavigation();

  // Run once when screen mounts
  useEffect(() => {
    log.setScreen('WelcomeScreen.js');
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Navigate to edit profile screen');
  };

  const handleMenuItemPress = (itemName) => {
    if (itemName === 'Bookings' || itemName === 'My bookings') {
        Alert.alert(`${itemName}`, `You tapped on ${itemName}`);
        //navigation.navigate('MyBookingScreen');
    } else {
        Alert.alert(`${itemName}`, `You tapped on ${itemName}`);
    }
    // Add your other navigation logic here
    // Example: navigation.navigate(itemName);
  };

  const handleQuickActionPress = (actionName) => {
    if (actionName === 'My bookings') {
      log.i("Navigating to BookingScreen from Menu item/quick Action");
      //navigation.navigate('MyBookingScreen');
    } else {
        Alert.alert(`${actionName}`, `You tapped on ${actionName}`);
    }
    // Add your navigation logic here
  };

  const handleTabPress = (tabName) => {
    if (tabName === 'Bookings') {
      log.i("Navigating to BookingScreen from Bottom Tab");
      //navigation.navigate('MyBookingScreen');
    } else if (tabName === 'CW') {
      navigation.navigate('HomeScreen');
    } else {
      Alert.alert(`${tabName} Tab`, `You tapped on ${tabName}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Prameet Sinha</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>+919880169055</Text>
              <Text style={styles.contactText}>prameet.sinha@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <MaterialIcon name="pencil" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.quickActionsContainer}>
          <QuickActionCard
            icon="clipboard-text"
            label="My bookings"
            onPress={() => handleQuickActionPress('My bookings')}
          />
          <QuickActionCard
            icon="headphones"
            label="Help & support"
            onPress={() => handleQuickActionPress('Help & support')}
          />
        </View>

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="briefcase"
            label="My Plans"
            onPress={() => handleMenuItemPress('My Plans')}
            isFirst={true}
          />
          <MenuItem
            icon="credit-card"
            label="Wallet"
            onPress={() => handleMenuItemPress('Wallet')}
          />
          <MenuItem
            icon="check-circle"
            label="Plus membership"
            onPress={() => handleMenuItemPress('Plus membership')}
          />
          <MenuItem
            icon="star"
            label="My rating"
            onPress={() => handleMenuItemPress('My rating')}
          />
          <MenuItem
            icon="map-marker"
            label="Manage addresses"
            onPress={() => handleMenuItemPress('Manage addresses')}
          />
          <MenuItem
            icon="credit-card"
            label="Manage payment methods"
            onPress={() => handleMenuItemPress('Manage payment methods')}
          />
          <MenuItem
            icon="cog"
            label="Settings"
            onPress={() => handleMenuItemPress('Settings')}
          />
          <MenuItem
            icon="book"
            label="About CW"
            onPress={() => handleMenuItemPress('About CW')}
            isLast={true}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Account" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

// MenuItem Component
const MenuItem = ({ icon, label, onPress, isFirst, isLast }) => {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isFirst && styles.menuItemFirst,
        isLast && styles.menuItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <MaterialIcon name={icon} size={20} color="#1a1a1a" />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <MaterialIcon name="chevron-right" size={20} color="#a0a0a0" />
    </TouchableOpacity>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcon name={icon} size={32} color="#1a1a1a" />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// Bottom Navigation Component
const navTabs = [
  { id: 'CW', label: 'CW', icon: 'briefcase-variant' },
  { id: 'Bookings', label: 'Bookings', icon: 'file-document-outline' },
  { id: 'Account', label: 'Account', icon: 'account' },
];

const BottomNavigation = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.bottomNavigation}>
      {navTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.navTab}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.id)}
          >
            <View style={styles.navTabContent}>
              {tab.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
              <MaterialIcon
                name={tab.icon}
                size={24}
                color={isActive ? '#1a1a1a' : '#a0a0a0'}
              />
            </View>
            <Text
              style={[
                styles.navTabLabel,
                isActive && styles.navTabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#666666',
  },
  editButton: {
    padding: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 24,
    backgroundColor: '#FFF5F9',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemFirst: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabContent: {
    alignItems: 'center',
    marginBottom: 4,
  },
  navTabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a0a0a0',
  },
  navTabLabelActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 20,
  },
});
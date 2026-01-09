import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/config';
import { AuthProvider } from './src/context/AuthContext';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LanguageSelection from './src/screens/LanguageSelection';
import ChooseAccount from './src/screens/ChooseAccount'; // only if exists
import ProviderSignUp from './src/screens/ProviderSignUp'; // only if exists
import ProviderExpertiseScreen from './src/screens/ProviderExpertiseScreen'; // only if exists
import ProviderHomeScreen from './src/screens/ProviderHomeScreen'; // only if exists
import UserSignUp from './src/screens/UserSignUp'; // only if exists
import OTPVerification from './src/screens/OTPVerification'; // only if exists
import ProviderOTPVerification from './src/screens/ProviderOTPVerification'; // only if exists
import HomeScreen from './src/screens/HomeScreen'; // only if exists
import AmmaList from './src/screens/AmmaList'; // only if exists
import MenuScreen from './src/screens/MenuScreen'; // only if exists


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* First screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Next screens */}
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
        <Stack.Screen name="ChooseAccount" component={ChooseAccount} />
        <Stack.Screen name="ProviderExpertiseScreen" component={ProviderExpertiseScreen} />
        <Stack.Screen name="ProviderSignUp" component={ProviderSignUp} />
        <Stack.Screen name="ProviderOTPVerification" component={ProviderOTPVerification} />
        <Stack.Screen name="ProviderHomeScreen" component={ProviderHomeScreen} />
        <Stack.Screen name="UserSignUp" component={UserSignUp} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AmmaList" component={AmmaList} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} />

        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
    </I18nextProvider>
  );
}

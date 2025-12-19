
CWApp (JavaScript)
---------------------------

External Dependencies
- Install choclatey and nodejs
- Need java jdk 17 and make sure its path are set correctly in env variable.
- Make sure NDK 27.1.* and cmake 3.22.1 is installed from android studio sdk manager
- Make sure ANDROID_HOME path is set in env variable like C:\Users\DELL\AppData\Local\Android\Sdk
---------------------------

Included:
- React Native structure (minimal)
- Send OTP screen + Verify OTP screen + Home screen
- React Navigation (native-stack)
- i18n setup (i18next)
- Firebase config using your google-services.json (already included in android/app/)

IMPORTANT:
1. This is a code bundle only. Run `npm install` or `yarn` in the project root to install dependencies.
2. Add SHA-1 and SHA-256 fingerprints in Firebase console (Project settings -> Android app) if you need phone auth on Android.
3. Ensure Firebase Phone Authentication is enabled and your project is on Blaze plan for real SMS sending.
4. To build for Android, open Android Studio or run `npx react-native run-android`.
5. If you get billing or quota errors, enable Blaze plan and check Firebase console logs.

Files:
- App.js: navigation + app entry
- index.js: react-native entry
- /screens/SendOtpScreen.js
- /screens/VerifyOtpScreen.js
- /screens/HomeScreen.js
- /i18n.js
- android/app/google-services.json (your uploaded file from firebase)

Notes:
- This bundle uses @react-native-firebase/auth for OTP. After npm install, follow react-native-firebase setup docs if needed.
- For production, secure reCAPTCHA settings or use SafetyNet/Play Integrity. 
- use @react-navigation/native: ^7.0.14
- use @react-navigation/native-stack: ^7.0.24
- Make sure NDK 27.1.* is installed from android studio sdk manager
- Run below command to get sha which need to be put in firebase project
keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android


How to run:

run npm install or yarn in the project root.

Add SHA-1 and SHA-256 fingerprints for your debug/release keys in Firebase Project Settings → Your app (Android). Phone Auth often needs SHA-256.
To get this:
cd android
gradlew signingReport

Install native dependencies for React Navigation:

npm install @react-navigation/native @react-navigation/native-stack

npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

npm install --save-dev @react-native-community/cli

npm install --save-dev @react-native/metro-config metro metro-core

npm install --save @react-native/assets

npm install i18next react-i18next

npm install i18next-browser-languagedetector

npm install @react-native-async-storage/async-storage

npm install @react-native/dev-middleware@latest

npm install @react-native-firebase/app @react-native-firebase/auth

npm install react-native-vector-icons

generate android folder
npx @react-native-community/cli init TempApp --version 0.82.1
copy Android and ios folder from TempApp

Follow additional native linking steps if required (run npx pod-install for iOS).

Run the app:

Start Metro: npx react-native start

Build & install: npx react-native run-android
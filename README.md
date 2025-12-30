This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.


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
- Run below command to get sha which need to be put in firebase project
- keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -storepass android -keypass android

run npm install in the project root.

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

generate android folder
npx @react-native-community/cli init TempApp --version 0.82.1
copy Android and ios folder from TempApp

Follow additional native linking steps if required (run npx pod-install for iOS).

Run the app:

Start Metro: npx react-native start

Build & install: npx react-native run-android

Alternative steps ( individual choice)
## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


release signing key

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
for: CN=alpha aid, OU=alphaaid, O=alphaaid, L=Greater Noida, ST=UP, C=IN
[Storing my-release-key.keystore]

passwd; Alphaaid@2025
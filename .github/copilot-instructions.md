# CWApp Copilot Instructions

## Project Overview
**CWApp** is a React Native healthcare marketplace app (v0.0.1) supporting multiple Indian languages. It connects users with healthcare providers (doctors, elderly care, counselors, physiotherapists, health educators, yoga instructors) and a product marketplace.

- **Tech Stack**: React Native 0.83, React Navigation 7, Firebase Auth, TypeScript, Jest, i18next
- **Target**: Android & iOS (iOS requires CocoaPods)
- **Language Support**: English, Hindi, Bengali, Kannada, Tamil, Telugu, Gujarati, Marathi
- **Build**: Metro bundler, React Native CLI

## Architecture

### Screen-Based Navigation Flow
All screens are in `src/screens/`. Navigation uses [React Navigation NativeStack](https://reactnavigation.org/docs/native-stack-navigator):

1. **WelcomeScreen** → Auto-navigates after 1s
2. **LanguageSelection** → User picks language (8 Indian languages supported)
3. **ChooseAccount** → User vs Provider selection
4. **UserSignUp** / **ProviderSignUp** → Phone number + Firebase OTP initiation
5. **OTPVerification** / **ProviderOTPVerification** → 6-digit OTP validation via Firebase
6. **ProviderExpertiseScreen** → Provider-specific workflow (after OTP)
7. **HomeScreen** → Main app (shows services & products)

### Key Patterns

**Language Propagation**: Language is passed via `route.params.language` (string: 'en'|'hi'|'bn'|'kn'|'ta'|'te'|'gu'|'mr') through every navigation call. Default is 'en'.

**Firebase Auth Flow**:
- `UserSignUp` calls `auth().signInWithPhoneNumber(fullPhone)` → returns `confirmation` object
- Passes `confirmation` object via navigation to `OTPVerification`
- `OTPVerification` calls `confirmation.confirm(otpCode)` to verify
- On success, navigate to HomeScreen or ProviderExpertiseScreen

**Safe Area**: Always wrap screens with `SafeAreaView` from `react-native-safe-area-context`. Use `useSafeAreaInsets()` hook for dynamic padding (see [WelcomeScreen](src/screens/WelcomeScreen.js#L17), [UserSignUp](src/screens/UserSignUp.js#L20)).

**Component Data**: Screens use local state (`useState`). HomeScreen has hardcoded services array & products array with mock data (id, name, icon/image, price, isFavorite, inCart fields).

## Key Files & Conventions

| File | Purpose |
|------|---------|
| `App.tsx` | Entry point; wraps app with SafeAreaProvider |
| `src/screens/*.js` | All screen components; mix of `.js` and `.tsx` extensions |
| `package.json` | Dependencies: `@react-native-firebase/{app,auth}`, `i18next`, `react-navigation` |
| `metro.config.js` | Metro bundler config (uses default + mergeConfig pattern) |
| `jest.config.js` | Test preset: `react-native` |
| `__tests__/App.test.tsx` | Example test file |

## Critical Developer Workflows

**Start Development Server**:
```bash
npm start
```
This runs Metro bundler. Keep terminal open; frontend auto-reloads on file save.

**Run Android**:
```bash
npm run android
```
Requires Android Studio/Emulator + JDK 20+.

**Run iOS**:
```bash
bundle install                    # First time only
bundle exec pod install           # Every time native deps change
npm run ios
```
Requires macOS + Xcode.

**Linting**:
```bash
npm run lint
```
Uses ESLint (config: `@react-native/eslint-config`).

**Testing**:
```bash
npm test
```
Jest with react-native preset.

**Force Reload** (if Metro doesn't catch changes):
- Android: Press `R` twice or Ctrl+M → Reload
- iOS: Press `R` in simulator

**Debugging**: Use React Native Dev Menu (Cmd+D on iOS, Ctrl+M on Android) for console logs & performance.

## Code Style & Patterns

**State Management**: Local `useState()` only; no Redux/Context yet.

 # CWApp — Agent Instructions

 This file describes the minimal, actionable knowledge an AI coding agent needs to be productive in this repository.

 1) Quick summary
 - React Native app (RN 0.83) with screen-based navigation in `src/screens/`.
 - Phone auth via `@react-native-firebase/auth` (OTP flow implemented in `UserSignUp.js` → `OTPVerification.js`).
 - Language is threaded through navigation: `route.params.language` (defaults to `'en'`).

 2) Most important files to inspect
 - [App.tsx](App.tsx) — app entry, SafeAreaProvider.
 - [src/screens/UserSignUp.js](src/screens/UserSignUp.js) — constructs `+91` phone, calls `auth().signInWithPhoneNumber()` and navigates with `confirmation`.
 - [src/screens/OTPVerification.js](src/screens/OTPVerification.js) — expects `route.params.confirmation` and calls `confirmation.confirm(otp)`.
 - [src/screens/WelcomeScreen.js](src/screens/WelcomeScreen.js) — shows language/navigation pattern.
 - [android/app/google-services.json](android/app/google-services.json) — required for Firebase on Android.

 3) Actionable patterns and examples
 - Always pass `language` and any auth objects through navigation. Example:

	 navigation.navigate('OTPVerification', { confirmation, language })

 - When reading params, use defaults:

	 const language = route?.params?.language || 'en';

 - Safe area: import and use `SafeAreaView` from `react-native-safe-area-context` and `useSafeAreaInsets()` for padding. See `App.tsx` and `src/screens/WelcomeScreen.js`.

 - Firebase phone flow: `auth().signInWithPhoneNumber(fullPhone)` returns a `confirmation` object which the verification screen must call `confirmation.confirm(code)` on.

 4) Build / run / debug (copy-paste)
 - Start Metro: `npm start`
 - Android (emulator/device): `npm run android` (needs JDK 20+ and Android Studio)
 - iOS (macOS only):
	 - `bundle install` (first time)
	 - `bundle exec pod install` (after native changes)
	 - `npm run ios`
 - Tests: `npm test`
 - Lint: `npm run lint`

 5) Project-specific gotchas (do not change these implicitly)
 - OTP flow requires passing the `confirmation` object; missing it breaks verification. See `src/screens/UserSignUp.js` → `OTPVerification.js`.
 - Phone numbers are built with `+91` in signup; do not drop the country code.
 - Repo mixes `.js`, `.ts`, `.tsx` — keep file's existing extension and style when editing.
 - No global state manager: most screens use `useState()`; introducing Context/Redux is a deliberate architectural change.

 6) Tests & CI notes
 - Only a small Jest example exists: [__tests__/App.test.tsx](__tests__/App.test.tsx). Focus tests on critical auth flows (sign-in → confirm) if you add coverage.

 7) Recommended agent behavior when editing
 - Preserve navigation params (`language`, `accountType`, `confirmation`) across screens.
 - Use `useSafeAreaInsets()` rather than platform-specific paddings.
 - Keep UI dependencies minimal — the app currently avoids third-party UI kits.
 - When adding native changes (Android/iOS), remind a human to run `pod install` (iOS) and validate `google-services.json` (Android).

 If any of these areas are unclear or you want the agent to expand patterns (e.g., add tests for OTP flow or convert screens to TypeScript), tell me which area to expand.

 Last updated: December 2025

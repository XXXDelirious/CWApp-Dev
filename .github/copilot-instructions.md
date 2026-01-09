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
## CWApp — Copilot instructions (concise)

CWApp is a React Native (0.83) healthcare marketplace that supports 8 Indian languages and Firebase phone auth. This file captures the minimal, actionable knowledge an AI coding agent needs to be productive here.

Key commands
- `npm start` — Metro dev server
- `npm run android` — Android build (Android Studio + JDK 20+)
- `npm run ios` — iOS (macOS): run `bundle install` once, then `bundle exec pod install` after native changes
- `npm test` — Jest
- `npm run lint` — ESLint

Architecture & important files
- Screens live in `src/screens/` and use React Navigation (native stack). Core screens: `WelcomeScreen.js`, `LanguageSelection.js`, `ChooseAccount.js`, `UserSignUp.js`, `OTPVerification.js`, `HomeScreen.js`, `Provider*` screens.
- Entry: `App.tsx` (wraps `SafeAreaProvider`).
- Firebase: Android config at `android/app/google-services.json`.

Patterns you must follow (explicit examples)
- Language propagation: pass `language` via navigation: `navigation.navigate('Some', { language })`. Read with `const language = route?.params?.language || 'en'`.
- Phone OTP flow: `auth().signInWithPhoneNumber(fullPhone)` returns `confirmation`; always pass that object to verification screen and call `confirmation.confirm(code)` in `OTPVerification.js`.
- Safe area: use `SafeAreaView` from `react-native-safe-area-context` and `useSafeAreaInsets()` for dynamic padding (see `src/screens/WelcomeScreen.js`).

Repo conventions & gotchas
- Keep file extensions as-is (mix of `.js`, `.ts`, `.tsx`) — do not convert files without instruction.
- Phone numbers use `+91` (India) in signup flows — do not remove country code.
- No global state manager: screens rely on local `useState()`; introducing global state is a deliberate architectural change.
- Android requires a valid `google-services.json` for Firebase flows to work locally.

Testing & CI
- Minimal Jest coverage exists at `__tests__/App.test.tsx`. When adding tests, focus on OTP/auth flow and navigation param preservation.

Editing guidance for agents
- Preserve navigation params (`language`, `confirmation`, `accountType`) across screens.
- When touching native iOS/Android code remind the user to run CocoaPods (`pod install`) or validate Android gradle config.
- Keep UI dependency additions minimal; prefer modifying existing components.

If any of these areas are unclear or you want broader edits (e.g., TypeScript migrations, adding OTP unit tests), tell me which area to expand.

Last updated: December 2025

@echo off
setlocal
set BASEDIR=%~dp0

echo === CWApp RN CLI Patch Script ===
echo Base dir: %BASEDIR%

cd /d "%BASEDIR%"

if exist CWApp (
  echo ERROR: CWApp already exists
  exit /b 1
)

echo Creating React Native app...
call npx @react-native-community/cli init CWApp --pm npm

echo RN CLI finished. Continuing script...
timeout /t 3 >nul

echo Removing RN defaults...
del /f /q CWApp\App.tsx 2>nul
rmdir /s /q CWApp\src 2>nul

echo Copying project files...

robocopy "%BASEDIR%cwcode\src" "%BASEDIR%CWApp\src" /E
robocopy "%BASEDIR%cwcode\assets" "%BASEDIR%CWApp\assets" /E
robocopy "%BASEDIR%cwcode\android" "%BASEDIR%CWApp\android" /E

copy /Y "%BASEDIR%cwcode\index.js" "%BASEDIR%CWApp\index.js"
copy /Y "%BASEDIR%cwcode\App.js" "%BASEDIR%CWApp\App.js"
copy /Y "%BASEDIR%cwcode\LANGUAGE_SETUP.md" "%BASEDIR%CWApp\LANGUAGE_SETUP.md"
copy /Y "%BASEDIR%cwcode\README.md.txt" "%BASEDIR%CWApp\README.md"

echo Installing dependencies...
pushd CWApp
call npm install

call npm install @react-navigation/native @react-navigation/native-stack

call npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

call npm install --save-dev @react-native-community/cli

call npm install --save-dev @react-native/metro-config metro metro-core

call npm install --save @react-native/assets

call npm install i18next react-i18next

call npm install i18next-browser-languagedetector

call npm install @react-native-async-storage/async-storage

call npm install @react-native/dev-middleware@latest

call npm install @react-native-firebase/app @react-native-firebase/auth

call npm install react-native-vector-icons

call npm install react-native-logs

echo === DONE SUCCESSFULLY ===
echo "Refer README file to check for other dependencies"
echo Need java jdk 17 and make sure its path are set correctly set in env variable.
echo Make sure NDK 27.1.* and cmake 3.22.1 is installed from android studio sdk manager
echo "To make android build run below command in newly created CWAPP directory"
echo "npx react-native run-android"

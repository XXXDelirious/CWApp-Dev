import { NativeModules, Platform } from 'react-native';

const { CWLogger } = NativeModules;

if (!CWLogger) {
  console.warn('CWLogger native module is not linked');
}

let currentScreen = 'Unknown';
let enabled = __DEV__; // release-safe by default

const log = {
  setScreen(screenName) {
    currentScreen = screenName;
  },

  setEnabled(value) {
    enabled = value;
    CWLogger?.setEnabled(value);
  },

  d(message, data) {
    send('d', message, data);
  },

  i(message, data) {
    send('i', message, data);
  },

  w(message, data) {
    send('w', message, data);
  },

  e(message, data) {
    send('e', message, data);
  },
};

function send(level, message, data) {
  if (!enabled || !CWLogger) return;

  const json =
    data === undefined
      ? ''
      : typeof data === 'string'
      ? data
      : JSON.stringify(data);

  CWLogger.log(level, currentScreen, String(message), json);
}

export default log;

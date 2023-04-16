import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'app.captureid.print.demo',
  appName: 'CIDPrintReact',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
    },
  },
};

export default config;

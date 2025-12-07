import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysticgarden.pro',
  appName: 'Mystic Garden Pro',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: 'mysticgarden-release.jks',
      keystoreAlias: 'mysticgarden',
    }
  }
};

export default config;

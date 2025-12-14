import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysticgarden.game',
  appName: 'Mystic Garden',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: 'mysticgarden-release.jks',
      keystoreAlias: 'mysticgarden',
    }
  }
};

export default config;

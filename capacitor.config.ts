import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysticgarden.game',
  appName: 'Mystic Garden',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: 'app/mystic-garden-key.jks',
      keystoreAlias: 'mysticgarden',
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'Mystic Garden',
    backgroundColor: '#1a0a2e'
  }
};

export default config;
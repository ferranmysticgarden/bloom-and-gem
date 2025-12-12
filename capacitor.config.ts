import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysticgarden.game',
  appName: 'Mystic Garden',
  webDir: 'dist',
  server: {
    url: 'https://3c83a2f7-47cb-4ba3-90ff-4fe57d4d7b89.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'mysticgarden-release.jks',
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
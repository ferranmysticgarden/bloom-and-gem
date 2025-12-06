import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysticgarden.pro',
  appName: 'Mystic Garden Pro',
  webDir: 'dist',
  server: {
    url: 'https://3c83a2f7-47cb-4ba3-90ff-4fe57d4d7b89.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;

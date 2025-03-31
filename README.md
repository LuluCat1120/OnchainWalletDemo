# OnchainWalletDemoExpo - Blockchain Wallet Demo

A blockchain wallet demonstration application developed with Expo and React Native, supporting cryptocurrency asset display, currency unit switching, and more.

## Features

- 🔒 Support for multiple cryptocurrency assets (BTC, ETH, DOGE, etc.)
- 💱 Currency unit switching (USD / HKD)
- 📊 Automatic asset value formatting (K/M/B)
- 🔗 Integrated native settings module
- 📱 Optimized mobile UI design

## Quick Start

### Requirements

- Node.js 18+
- Xcode 14+ (for iOS development)
- Android Studio (for Android development)
- npm or yarn

### Installation Steps

1. Clone the project to your local machine

   ```bash
   git clone https://github.com/LuluCat1120/OnchainWalletDemo.git
   cd OnchainWalletDemoExpo
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Launch the application

   ```bash
   # Normal startup
   npm run ios
   
   # If you encounter network issues, use the following command to clean cache and restart
   sh cleanAndStart.sh
   ```

## Troubleshooting

If you encounter "fetch failed" or loading issues, try:

1. Clean the cache
   ```bash
   # Clean cache
   rm -rf node_modules/.cache
   watchman watch-del-all
   ```

2. Use the provided script for one-click cleaning and startup
   ```bash
   sh cleanAndStart.sh
   ```

## Project Structure

```
app/             # Main application code
├── (tabs)       # Bottom tabs
│   ├── assets.tsx    # Assets page
│   └── ...
├── settings.tsx  # Settings page
hooks/           # React hooks
├── useCurrencyContext.tsx  # Currency context
├── useWalletSettingsModule.tsx  # Wallet settings module
ios/             # iOS native code
├── SettingsModule  # Native settings module
utils/           # Utility functions
├── CurrencyParser.ts  # Currency formatting utilities
```

## Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Contribution Guidelines

Pull Requests and Issues are welcome to help improve this project!

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { CurrencyProvider } from '../hooks/useCurrencyContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CurrencyProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              title: '', 
              headerTitle: ''
            }} 
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen 
            name="settings" 
            options={{ 
              headerShown: true,
              title: "Settings",
              headerTitleAlign: "center",
              headerBackVisible: true,
              headerTintColor: "#007AFF",
              headerStyle: {
                backgroundColor: "#f8f8f8"
              },
              headerTitleStyle: {
                fontWeight: "600"
              }
            }} 
          />
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              title: '', 
              headerTitle: ''
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CurrencyProvider>
  );
}

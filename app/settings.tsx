import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useCurrency } from '../hooks/useCurrencyContext';
import { useWalletSettingsModule } from '../hooks/useWalletSettingsModule';

export default function SettingsScreen() {
  // Use currency context
  const { fiatCurrency } = useCurrency();
  
  // Use wallet settings module
  const walletModule = useWalletSettingsModule();
  const isModuleAvailable = walletModule.isModuleAvailable;
  
  // Track native settings state
  const [isOpeningNativeSettings, setIsOpeningNativeSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Open native settings interface
  const openNativeSettings = async () => {
    if (!isModuleAvailable || Platform.OS !== 'ios') {
      setError('Native settings module not available');
      return;
    }

    try {
      setIsOpeningNativeSettings(true);
      setError(null);
      
      const result = await walletModule.openSettingsPage();
      console.log('Native settings opened:', result);
      
      // Note: Native interface will remain open until user closes it
      // So we don't reset isOpeningNativeSettings
    } catch (error) {
      console.error('Failed to open native settings:', error);
      setError('Error opening native settings');
      setIsOpeningNativeSettings(false);
    }
  };

  // If opening native settings, show loading
  if (isOpeningNativeSettings) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Opening native settings...</Text>
      </SafeAreaView>
    );
  }
  
  // Show error message (if any)
  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={openNativeSettings}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Show regular settings interface with a button to open native settings (if on iOS and module available)
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Settings',
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        {Platform.OS === 'ios' && isModuleAvailable && (
          <TouchableOpacity 
            style={styles.nativeButton}
            onPress={openNativeSettings}
          >
            <Text style={styles.buttonText}>Open Native Settings</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Current Currency: {fiatCurrency}</Text>
          <Text style={styles.infoText}>
            This interface allows you to change the currency displayed in the app.
            {Platform.OS === 'ios' && isModuleAvailable 
              ? ' Click the button above to open native settings for the best experience.' 
              : ''}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#007AFF',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoSection: {
    padding: 16,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginVertical: 20,
  },
  nativeButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
}); 
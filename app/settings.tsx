import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useCurrency } from '../hooks/useCurrencyContext';
import { useWalletSettingsModule } from '../hooks/useWalletSettingsModule';

export default function SettingsScreen() {
  // Use currency context
  const { fiatCurrency, toggleCurrency } = useCurrency();
  const [isUSD, setIsUSD] = useState(fiatCurrency === 'USD');
  
  // Use wallet settings module
  const walletModule = useWalletSettingsModule();
  const isModuleAvailable = walletModule.isModuleAvailable;

  // Update switch state when currency changes
  useEffect(() => {
    setIsUSD(fiatCurrency === 'USD');
  }, [fiatCurrency]);

  // Handle currency toggle
  const handleCurrencyToggle = () => {
    toggleCurrency();
  };
  
  // Open native settings if available
  useEffect(() => {
    if (isModuleAvailable && Platform.OS === 'ios') {
      openNativeSettings();
    }
  }, [isModuleAvailable]);
  
  const openNativeSettings = async () => {
    try {
      // Use type assertion to handle the property
      // @ts-ignore - The type definition doesn't include openSettingsPage yet
      if (walletModule.openSettingsPage) {
        // @ts-ignore
        await walletModule.openSettingsPage();
      }
    } catch (error) {
      console.error('Failed to open native settings:', error);
    }
  };

  // Only render React Native settings if native module is not available
  if (isModuleAvailable && Platform.OS === 'ios') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading native settings...</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.sectionTitle}>Currency Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Currency Unit</Text>
          <View style={styles.settingValue}>
            <Text style={styles.currencyText}>
              {isUSD ? 'USD ($)' : 'HKD (HK$)'}
            </Text>
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Use USD</Text>
          <Switch
            value={isUSD}
            onValueChange={handleCurrencyToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isUSD ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleCurrencyToggle}
        >
          <Text style={styles.buttonText}>
            Switch to {isUSD ? 'HKD' : 'USD'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Switching currency will change the display currency for all asset values in the app.
        </Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 16,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
}); 
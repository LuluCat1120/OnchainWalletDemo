import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for currency setting
const CURRENCY_STORAGE_KEY = 'app_currency_setting';

export default function SettingsScreen() {
  const [currency, setCurrency] = useState<string>("USD");
  
  useEffect(() => {
    // Load saved currency setting
    const loadSavedCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        if (savedCurrency) {
          setCurrency(savedCurrency);
        }
      } catch (error) {
        console.error("Failed to load currency setting:", error);
      }
    };

    loadSavedCurrency();
  }, []);

  const handleToggleCurrency = async () => {
    // Toggle between USD and HKD
    const newCurrency = currency === 'USD' ? 'HKD' : 'USD';
    
    // Update local state
    setCurrency(newCurrency);
    
    // Save to storage for other components to access
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      console.log("Currency saved:", newCurrency);
    } catch (error) {
      console.error("Failed to save currency setting:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Currency settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Currency</Text>
          <View style={styles.currencySelector}>
            <Text style={styles.currencyText}>
              {currency === 'USD' ? 'US Dollar (USD)' : 'Hong Kong Dollar (HKD)'}
            </Text>
            <Switch
              value={currency === 'HKD'}
              onValueChange={handleToggleCurrency}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={currency === 'HKD' ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
      
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: -10,
    marginLeft: 16,
    marginBottom: 5,
    backgroundColor: '#f8f8f8',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    marginRight: 8,
    fontSize: 16,
    color: '#666',
  },
}); 
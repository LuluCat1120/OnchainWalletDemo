import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as usdRates from '../assets/data/Fiat_rate_usd.json';
import * as hkdRates from '../assets/data/Fiat_rate_hkd.json';
import * as currencies from '../assets/data/Currency.json';
import { useWalletSettingsModule } from './useWalletSettingsModule';

type CurrencyType = 'USD' | 'HKD';
const CURRENCY_STORAGE_KEY = 'currency';

interface CurrencyContextType {
  fiatCurrency: CurrencyType;
  toggleCurrency: () => void;
  getCurrencyData: () => any[];
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fiatCurrency, setFiatCurrency] = useState<CurrencyType>('USD');
  const { 
    isModuleAvailable, 
    toggleCurrency: toggleNativeCurrency, 
    getCurrentCurrency, 
    setCurrency: setNativeCurrency,
    addCurrencyChangeListener 
  } = useWalletSettingsModule();

  // Initialize currency settings
  useEffect(() => {
    const initCurrency = async () => {
      try {
        // First try to get from AsyncStorage
        const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        
        if (isModuleAvailable) {
          // If native module is available, get from native module
          const nativeCurrency = await getCurrentCurrency() as CurrencyType;
          
          if (storedCurrency) {
            // If stored value is inconsistent with native module, update native module
            if (storedCurrency !== nativeCurrency) {
              await setNativeCurrency(storedCurrency as CurrencyType);
            }
            setFiatCurrency(storedCurrency as CurrencyType);
          } else if (nativeCurrency) {
            // If no stored value but native value exists, use native value and store it
            setFiatCurrency(nativeCurrency);
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, nativeCurrency);
          }
        } else if (storedCurrency) {
          // If native module is not available but stored value exists, use directly
          setFiatCurrency(storedCurrency as CurrencyType);
        }
      } catch (error) {
        console.error('Failed to initialize currency settings:', error);
      }
    };

    initCurrency();
  }, [isModuleAvailable, getCurrentCurrency, setNativeCurrency]);

  // Listen for currency change events
  useEffect(() => {
    if (!isModuleAvailable) return;

    console.log('Setting up currency change listener');
    const subscription = addCurrencyChangeListener((currency) => {
      console.log('Currency changed to:', currency);
      setFiatCurrency(currency as CurrencyType);
      // Sync to AsyncStorage
      AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency).catch(
        err => console.error('Failed to save currency setting:', err)
      );
    });

    return () => {
      subscription.remove();
    };
  }, [isModuleAvailable, addCurrencyChangeListener]);

  // Toggle currency
  const toggleCurrency = async () => {
    try {
      const newCurrency = fiatCurrency === 'USD' ? 'HKD' : 'USD';
      
      // Update state
      setFiatCurrency(newCurrency);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      
      // If native module is available, sync to native module
      if (isModuleAvailable) {
        await setNativeCurrency(newCurrency);
      }
    } catch (error) {
      console.error('Failed to toggle currency:', error);
    }
  };

  // Method to get currency data
  const getCurrencyData = useCallback(() => {
    const currencyData = currencies.currencies;
    const ratesData = fiatCurrency === 'USD' ? usdRates.rates : hkdRates.rates;

    // Generate random price change percentage
    const getRandomChange = () => {
      return (Math.random() * 20 - 10).toFixed(2);
    };

    // Pre-generate price changes for each currency
    const priceChanges: Record<number, string> = {};
    currencyData.forEach(currency => {
      priceChanges[currency.id] = getRandomChange();
    });

    return currencyData.map((currency) => {
      const rate = ratesData.find(r => r.id === currency.id);
      return {
        ...currency,
        fiatRate: rate?.fiat_rate || '0',
        fiatSymbol: fiatCurrency,
        fiatValue: (parseFloat(rate?.fiat_rate || '0') * currency.amount).toString(),
        priceChange: priceChanges[currency.id] || '0.00',
        color: getColorForSymbol(currency.symbol)
      };
    });
  }, [fiatCurrency]);

  // Get color for currency symbol
  const getColorForSymbol = (symbol: string): string => {
    const colorMap: Record<string, string> = {
      BTC: '#F7931A',
      ETH: '#627EEA',
      CRO: '#103F68',
      SOL: '#00FFA3',
      MATIC: '#8247E5',
      ATOM: '#2E3148',
      DOGE: '#C2A633'
    };
    return colorMap[symbol] || '#888888';
  };

  const getCurrencySymbol = useCallback(() => {
    return fiatCurrency === 'USD' ? '$' : 'HK$';
  }, [fiatCurrency]);

  return (
    <CurrencyContext.Provider value={{ 
      fiatCurrency, 
      toggleCurrency, 
      getCurrencyData,
      getCurrencySymbol
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 
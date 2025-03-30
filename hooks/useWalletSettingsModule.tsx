import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import { useState, useEffect } from 'react';

// Type definitions
interface WalletSettingsModuleType {
  toggleCurrency(): Promise<string>;
  getCurrency(): Promise<string>;
  setCurrency(currency: string): Promise<string>;
  openSettingsPage(): Promise<boolean>;
}

// Currency change event data type
interface CurrencyChangeEvent {
  currency: string;
}

// Get native module - get the correct module name based on platform
const getSettingsModule = () => {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsModule;
  } else {
    return NativeModules.SettingsModuleModule;
  }
};

const SettingsModuleModule = getSettingsModule();

// Event emitter
// Ensure we only create the emitter if the module exists
const settingsEmitter = SettingsModuleModule
  ? new NativeEventEmitter(SettingsModuleModule)
  : null;

// Currency change listener function type
type CurrencyChangeListener = (currency: string) => void;

// Mock module - used when the native module is not available
const mockModule: WalletSettingsModuleType = {
  async toggleCurrency() {
    console.warn('Using mock wallet settings module - toggleCurrency');
    return 'USD';
  },
  async getCurrency() {
    console.warn('Using mock wallet settings module - getCurrency');
    return 'USD';
  },
  async setCurrency(currency: string) {
    console.warn('Using mock wallet settings module - setCurrency', currency);
    return currency;
  },
  async openSettingsPage() {
    console.warn('Using mock wallet settings module - openSettingsPage');
    return false;
  }
};

// Export hook
export function useWalletSettingsModule() {
  // Track current currency state
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  
  // Check if native module is available
  const isModuleAvailable = !!SettingsModuleModule;
  const module = isModuleAvailable ? SettingsModuleModule : mockModule;
  
  // Initialize by getting current currency
  useEffect(() => {
    if (isModuleAvailable) {
      module.getCurrency().then((currency: string) => {
        setCurrentCurrency(currency);
      }).catch((err: Error) => {
        console.error('Failed to get native currency setting:', err);
      });
    }
  }, [isModuleAvailable, module]);

  // Add currency change event listener
  const addCurrencyChangeListener = (listener: CurrencyChangeListener) => {
    if (!isModuleAvailable || !settingsEmitter) {
      console.warn('Native wallet settings module not available, cannot add event listener');
      return { remove: () => {} };
    }

    const subscription = settingsEmitter.addListener(
      'onCurrencyChange',
      (event: CurrencyChangeEvent | string) => {
        console.log('Received currency change event:', event);
        if (event && typeof event === 'object' && 'currency' in event) {
          const newCurrency = event.currency;
          setCurrentCurrency(newCurrency);
          listener(newCurrency);
        } else if (typeof event === 'string') {
          // Handle case where string is returned directly
          setCurrentCurrency(event);
          listener(event);
        } else {
          console.warn('Received currency change event with incorrect format:', event);
        }
      }
    );

    return {
      remove: () => subscription.remove()
    };
  };
  
  // Wrap native methods and handle state updates
  const toggleCurrency = async (): Promise<string> => {
    try {
      const newCurrency = await module.toggleCurrency();
      setCurrentCurrency(newCurrency);
      return newCurrency;
    } catch (error) {
      console.error('Failed to toggle currency:', error);
      throw error;
    }
  };
  
  const setCurrency = async (currency: string): Promise<string> => {
    try {
      const result = await module.setCurrency(currency);
      setCurrentCurrency(result);
      return result;
    } catch (error) {
      console.error('Failed to set currency:', error);
      throw error;
    }
  };

  return {
    isModuleAvailable,
    toggleCurrency,
    getCurrentCurrency: module.getCurrency,
    setCurrency,
    openSettingsPage: module.openSettingsPage,
    addCurrencyChangeListener,
    // Expose current state
    currentCurrency
  };
} 
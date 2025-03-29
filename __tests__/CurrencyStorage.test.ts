import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for currency setting - must match the key used in settings.tsx
const CURRENCY_STORAGE_KEY = 'app_currency_setting';

// Helper functions for currency settings
const saveCurrencySetting = async (currency: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch (error) {
    console.error('Failed to save currency setting:', error);
  }
};

const loadCurrencySetting = async (): Promise<string> => {
  try {
    const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
    return savedCurrency || 'USD'; // Default to USD if nothing saved
  } catch (error) {
    console.error('Failed to load currency setting:', error);
    return 'USD'; // Default to USD on error
  }
};

describe('Currency Storage Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('saves currency setting to AsyncStorage', async () => {
    await saveCurrencySetting('HKD');
    
    // Verify AsyncStorage.setItem was called with correct parameters
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CURRENCY_STORAGE_KEY, 'HKD');
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('loads default currency when nothing is stored', async () => {
    // Mock AsyncStorage.getItem to return null (nothing stored)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    
    const currency = await loadCurrencySetting();
    
    // Verify default value is returned
    expect(currency).toBe('USD');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CURRENCY_STORAGE_KEY);
  });

  it('loads saved currency from AsyncStorage', async () => {
    // Mock AsyncStorage.getItem to return a stored value
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('HKD');
    
    const currency = await loadCurrencySetting();
    
    // Verify saved value is returned
    expect(currency).toBe('HKD');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CURRENCY_STORAGE_KEY);
  });

  it('handles errors when saving currency', async () => {
    // Mock console.error to verify it's called
    console.error = jest.fn();
    
    // Mock AsyncStorage.setItem to throw an error
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      new Error('Storage error')
    );
    
    await saveCurrencySetting('USD');
    
    // Verify error handling
    expect(console.error).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CURRENCY_STORAGE_KEY, 'USD');
  });

  it('handles errors when loading currency', async () => {
    // Mock console.error to verify it's called
    console.error = jest.fn();
    
    // Mock AsyncStorage.getItem to throw an error
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
      new Error('Storage error')
    );
    
    const currency = await loadCurrencySetting();
    
    // Verify error handling and default return
    expect(console.error).toHaveBeenCalled();
    expect(currency).toBe('USD');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CURRENCY_STORAGE_KEY);
  });
}); 
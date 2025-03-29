import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from '../app/settings';
import { Switch } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

// Spy on console methods
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default value for AsyncStorage.getItem
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('USD');
  });
  
  it('renders correctly with default currency', async () => {
    const { getByText, UNSAFE_getAllByType } = render(<SettingsScreen />);
    
    // Wait for AsyncStorage to resolve
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('currency');
    });
    
    // Check for USD text
    expect(getByText('US Dollar (USD)')).toBeTruthy();
    
    // Find the Switch component directly since testID might not be set
    const switches = UNSAFE_getAllByType(Switch);
    expect(switches.length).toBeGreaterThan(0);
  });
  
  it('loads saved currency from AsyncStorage', async () => {
    // Set HKD as the saved currency
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('HKD');
    
    const { getByText } = render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('currency');
      expect(getByText('Hong Kong Dollar (HKD)')).toBeTruthy();
    });
  });
  
  it('toggles currency when switch is pressed', async () => {
    const { getByText, UNSAFE_getAllByType } = render(<SettingsScreen />);
    
    // Initial state is USD
    await waitFor(() => {
      expect(getByText('US Dollar (USD)')).toBeTruthy();
    });
    
    // Find and toggle switch without using testID
    const switches = UNSAFE_getAllByType(Switch);
    expect(switches.length).toBeGreaterThan(0);
    
    const currencySwitch = switches[0];
    fireEvent(currencySwitch, 'onValueChange', true);
    
    await waitFor(() => {
      // Verify currency changed to HKD
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('currency', 'HKD');
      expect(getByText('Hong Kong Dollar (HKD)')).toBeTruthy();
    });
  });
  
  it('handles AsyncStorage errors gracefully', async () => {
    // Mock AsyncStorage.getItem to throw an error
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
    
    render(<SettingsScreen />);
    
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('currency');
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 
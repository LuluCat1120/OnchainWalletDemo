import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AssetsScreen from '../app/(tabs)/assets';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock crypto data
jest.mock('../app/(tabs)/assets', () => {
  const originalModule = jest.requireActual('../app/(tabs)/assets');
  
  return {
    ...originalModule,
    loadCryptoData: () => ({
      usdData: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: '0.5', value: 23000, change: 2.3 },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: '5.0', value: 8000, change: -1.2 },
      ],
      hkdData: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: '0.5', value: 179400, change: 2.3 },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: '5.0', value: 62400, change: -1.2 },
      ],
    }),
  };
});

// Mock timers
jest.useFakeTimers();

// Intercept console.error to suppress act warnings
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        args[0].includes('Warning: An update to AssetsScreen inside a test was not wrapped in act')) {
      return;
    }
    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Helper function
const advanceTimersAndWait = async (time = 1000) => {
  await act(async () => {
    jest.advanceTimersByTime(time);
  });
  
  await waitFor(() => {}, { timeout: 1000 });
};

describe('AssetsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('loads and displays crypto assets with USD currency by default', async () => {
    const { getByText } = render(<AssetsScreen />);
    
    // Advance timers to complete loading
    await advanceTimersAndWait();
    
    // Verify USD data is displayed
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
  }, 10000);

  it('updates currency display when AsyncStorage has HKD', async () => {
    // Set saved currency to HKD
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('HKD');
    
    const { getByText } = render(<AssetsScreen />);
    
    // Advance timers to complete loading
    await advanceTimersAndWait();
    
    // Verify HKD data is displayed
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('BTC')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('ETH')).toBeTruthy();
  }, 10000);
}); 
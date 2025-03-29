import { renderHook, act } from '@testing-library/react-hooks';
import { useCurrency, CurrencyProvider } from '../hooks/useCurrencyContext';
import React from 'react';

// 模拟JSON数据
jest.mock('../assets/data/Currency.json', () => ({
  currencies: [
    {
      name: 'bitcoin',
      symbol: 'BTC',
      id: 1,
      amount: 2.1
    },
    {
      name: 'ethereum',
      symbol: 'ETH',
      id: 2,
      amount: 10.8
    }
  ]
}));

jest.mock('../assets/data/Fiat_rate_usd.json', () => ({
  rates: [
    {
      fiat_rate: '60000',
      fiat_symbol: 'USD',
      id: 1,
      symbol: 'BTC'
    },
    {
      fiat_rate: '3350',
      fiat_symbol: 'USD',
      symbol: 'ETH',
      id: 2
    }
  ]
}));

jest.mock('../assets/data/Fiat_rate_hkd.json', () => ({
  rates: [
    {
      fiat_rate: '47430',
      fiat_symbol: 'HKD',
      id: 1,
      symbol: 'BTC'
    },
    {
      fiat_rate: '26100',
      fiat_symbol: 'HKD',
      symbol: 'ETH',
      id: 2
    }
  ]
}));

// 模拟原生模块
jest.mock('../hooks/useWalletSettingsModule', () => ({
  useWalletSettingsModule: () => ({
    isModuleAvailable: false,
    toggleCurrency: jest.fn(),
    getCurrentCurrency: jest.fn(),
    addCurrencyChangeListener: jest.fn(() => ({ remove: jest.fn() }))
  })
}));

describe('useCurrency', () => {
  it('should initialize with USD as default currency', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CurrencyProvider>{children}</CurrencyProvider>
    );
    
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    expect(result.current.fiatCurrency).toBe('USD');
    expect(result.current.getCurrencySymbol()).toBe('USD');
  });
  
  it('should toggle currency between USD and HKD', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CurrencyProvider>{children}</CurrencyProvider>
    );
    
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    // 初始为USD
    expect(result.current.fiatCurrency).toBe('USD');
    
    // 切换到HKD
    act(() => {
      result.current.toggleCurrency();
    });
    
    expect(result.current.fiatCurrency).toBe('HKD');
    
    // 再次切换回USD
    act(() => {
      result.current.toggleCurrency();
    });
    
    expect(result.current.fiatCurrency).toBe('USD');
  });
  
  it('should return correct currency data with USD rates', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CurrencyProvider>{children}</CurrencyProvider>
    );
    
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    const currencyData = result.current.getCurrencyData();
    
    expect(currencyData).toHaveLength(2);
    expect(currencyData[0].name).toBe('bitcoin');
    expect(currencyData[0].fiatSymbol).toBe('USD');
    expect(currencyData[0].fiatValue).toBe('126000');  // 2.1 * 60000
    expect(currencyData[1].name).toBe('ethereum');
    expect(currencyData[1].fiatValue).toBe('36180');   // 10.8 * 3350
  });
  
  it('should return correct currency data with HKD rates after toggle', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CurrencyProvider>{children}</CurrencyProvider>
    );
    
    const { result } = renderHook(() => useCurrency(), { wrapper });
    
    // 切换到HKD
    act(() => {
      result.current.toggleCurrency();
    });
    
    const currencyData = result.current.getCurrencyData();
    
    expect(currencyData).toHaveLength(2);
    expect(currencyData[0].name).toBe('bitcoin');
    expect(currencyData[0].fiatSymbol).toBe('HKD');
    expect(currencyData[0].fiatValue).toBe('99603');   // 2.1 * 47430
    expect(currencyData[1].name).toBe('ethereum');
    expect(currencyData[1].fiatValue).toBe('281880');  // 10.8 * 26100
  });
}); 
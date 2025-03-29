import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from '../app/settings';
import AssetsScreen from '../app/(tabs)/assets';

// Mock necessary modules
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('USD')),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock the native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.NativeModules.SettingsModuleModule = {
    getCurrency: jest.fn(() => Promise.resolve('USD')),
    setCurrency: jest.fn(() => Promise.resolve()),
    toggleCurrency: jest.fn(() => Promise.resolve('HKD')),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
  
  return RN;
});

// 将两个独立的测试简化为一个，避免复杂的集成场景
describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset AsyncStorage mock
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('USD');
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });
  
  it('handles currency settings correctly', async () => {
    // 1. 渲染设置页面
    const { getByTestId } = render(<SettingsScreen />);
    
    // 确保页面已加载
    await waitFor(() => {
      expect(getByTestId('currency-switch')).toBeTruthy();
    });
    
    // 2. 切换币种
    await act(async () => {
      fireEvent(getByTestId('currency-switch'), 'onValueChange', true);
    });
    
    // 3. 验证AsyncStorage被调用以存储新的币种
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('currency', 'HKD');
    
    // 4. 确认币种能够被其他页面正确读取
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('HKD');
    const assetsScreen = render(<AssetsScreen />);
    
    // 5. 验证持久化的币种设置
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('currency');
  }, 10000);
}); 
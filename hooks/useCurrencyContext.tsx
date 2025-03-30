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

  // 初始化货币设置
  useEffect(() => {
    const initCurrency = async () => {
      try {
        // 首先尝试从AsyncStorage获取
        const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        
        if (isModuleAvailable) {
          // 如果原生模块可用，从原生模块获取
          const nativeCurrency = await getCurrentCurrency() as CurrencyType;
          
          if (storedCurrency) {
            // 如果储存的值与原生模块不一致，更新原生模块
            if (storedCurrency !== nativeCurrency) {
              await setNativeCurrency(storedCurrency as CurrencyType);
            }
            setFiatCurrency(storedCurrency as CurrencyType);
          } else if (nativeCurrency) {
            // 如果没有储存的值但有原生值，使用原生值并储存
            setFiatCurrency(nativeCurrency);
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, nativeCurrency);
          }
        } else if (storedCurrency) {
          // 如果原生模块不可用但有储存的值，直接使用
          setFiatCurrency(storedCurrency as CurrencyType);
        }
      } catch (error) {
        console.error('初始化货币设置失败:', error);
      }
    };

    initCurrency();
  }, [isModuleAvailable, getCurrentCurrency, setNativeCurrency]);

  // 监听货币变更事件
  useEffect(() => {
    if (!isModuleAvailable) return;

    console.log('设置货币变更监听器');
    const subscription = addCurrencyChangeListener((currency) => {
      console.log('货币已变更为:', currency);
      setFiatCurrency(currency as CurrencyType);
      // 同步到AsyncStorage
      AsyncStorage.setItem(CURRENCY_STORAGE_KEY, currency).catch(
        err => console.error('保存货币设置失败:', err)
      );
    });

    return () => {
      subscription.remove();
    };
  }, [isModuleAvailable, addCurrencyChangeListener]);

  // 切换货币
  const toggleCurrency = async () => {
    try {
      const newCurrency = fiatCurrency === 'USD' ? 'HKD' : 'USD';
      
      // 更新状态
      setFiatCurrency(newCurrency);
      
      // 保存到AsyncStorage
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      
      // 如果原生模块可用，同步到原生模块
      if (isModuleAvailable) {
        await setNativeCurrency(newCurrency);
      }
    } catch (error) {
      console.error('切换货币失败:', error);
    }
  };

  // 获取货币数据的方法
  const getCurrencyData = useCallback(() => {
    const currencyData = currencies.currencies;
    const ratesData = fiatCurrency === 'USD' ? usdRates.rates : hkdRates.rates;

    // 生成随机价格变化百分比
    const getRandomChange = () => {
      return (Math.random() * 20 - 10).toFixed(2);
    };

    // 预生成每个币种的价格变化
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

  // 获取币种的颜色
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
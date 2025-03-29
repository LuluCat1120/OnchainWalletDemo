import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as usdRates from '../assets/data/Fiat_rate_usd.json';
import * as hkdRates from '../assets/data/Fiat_rate_hkd.json';
import * as currencies from '../assets/data/Currency.json';
import { useWalletSettingsModule } from './useWalletSettingsModule';

type CurrencyType = 'USD' | 'HKD';

interface CurrencyContextType {
  fiatCurrency: CurrencyType;
  toggleCurrency: () => void;
  getCurrencyData: () => any[];
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fiatCurrency, setFiatCurrency] = useState<CurrencyType>('USD');
  const { isModuleAvailable, toggleCurrency: toggleNativeCurrency, getCurrentCurrency, addCurrencyChangeListener } = useWalletSettingsModule();

  // 初始化货币设置
  useEffect(() => {
    const initCurrency = async () => {
      if (isModuleAvailable) {
        try {
          const currency = await getCurrentCurrency() as CurrencyType;
          setFiatCurrency(currency);
        } catch (error) {
          console.error('获取货币设置失败:', error);
        }
      }
    };

    initCurrency();
  }, [isModuleAvailable, getCurrentCurrency]);

  // 监听货币变更事件
  useEffect(() => {
    if (!isModuleAvailable) return;

    const subscription = addCurrencyChangeListener((currency) => {
      setFiatCurrency(currency as CurrencyType);
    });

    return () => {
      subscription.remove();
    };
  }, [isModuleAvailable, addCurrencyChangeListener]);

  // 切换货币
  const toggleCurrency = async () => {
    if (isModuleAvailable) {
      try {
        const newCurrency = await toggleNativeCurrency() as CurrencyType;
        setFiatCurrency(newCurrency);
      } catch (error) {
        console.error('切换货币失败:', error);
        // 回退到JS实现
        setFiatCurrency(prev => (prev === 'USD' ? 'HKD' : 'USD'));
      }
    } else {
      // 当原生模块不可用时使用JS实现
      setFiatCurrency(prev => (prev === 'USD' ? 'HKD' : 'USD'));
    }
  };

  const getCurrencyData = () => {
    const currencyData = currencies.currencies;
    const ratesData = fiatCurrency === 'USD' ? usdRates.rates : hkdRates.rates;

    return currencyData.map((currency) => {
      const rate = ratesData.find(r => r.id === currency.id);
      return {
        ...currency,
        fiatRate: rate?.fiat_rate || '0',
        fiatSymbol: fiatCurrency,
        fiatValue: (parseFloat(rate?.fiat_rate || '0') * currency.amount).toString()
      };
    });
  };

  const getCurrencySymbol = () => {
    return fiatCurrency;
  };

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
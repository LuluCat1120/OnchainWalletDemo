import { Platform, NativeModules, NativeEventEmitter } from 'react-native';

// 类型定义
interface WalletSettingsModuleType {
  toggleCurrency(): Promise<string>;
  getCurrentCurrency(): Promise<string>;
}

// 获取原生模块
const WalletSettingsModule = NativeModules.WalletSettingsModule as WalletSettingsModuleType;

// 事件发射器
const walletSettingsEmitter = new NativeEventEmitter(
  Platform.OS === 'ios' ? NativeModules.WalletSettingsModule : null
);

// 货币变更事件监听函数类型
type CurrencyChangeListener = (currency: string) => void;

// 模拟模块 - 当原生模块不可用时使用
const mockModule: WalletSettingsModuleType = {
  async toggleCurrency() {
    console.warn('使用模拟的钱包设置模块 - toggleCurrency');
    return 'USD';
  },
  async getCurrentCurrency() {
    console.warn('使用模拟的钱包设置模块 - getCurrentCurrency');
    return 'USD';
  }
};

// 导出钩子
export function useWalletSettingsModule() {
  // 检查原生模块是否可用
  const isModuleAvailable = !!WalletSettingsModule;
  const module = isModuleAvailable ? WalletSettingsModule : mockModule;

  // 添加货币变更事件监听器
  const addCurrencyChangeListener = (listener: CurrencyChangeListener) => {
    if (!isModuleAvailable) {
      console.warn('原生钱包设置模块不可用，无法添加事件监听器');
      return { remove: () => {} };
    }

    const subscription = walletSettingsEmitter.addListener(
      'onCurrencyChanged',
      (event) => {
        listener(event.currency);
      }
    );

    return {
      remove: () => subscription.remove()
    };
  };

  return {
    isModuleAvailable,
    toggleCurrency: module.toggleCurrency,
    getCurrentCurrency: module.getCurrentCurrency,
    addCurrencyChangeListener
  };
} 
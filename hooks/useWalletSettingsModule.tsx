import { Platform, NativeModules, NativeEventEmitter } from 'react-native';

// 类型定义
interface WalletSettingsModuleType {
  toggleCurrency(): Promise<string>;
  getCurrency(): Promise<string>;
  setCurrency(currency: string): Promise<string>;
  openSettingsPage(): Promise<boolean>;
}

// 获取原生模块
const SettingsModuleModule = NativeModules.SettingsModuleModule as WalletSettingsModuleType;

// 事件发射器
// 确保只在模块存在时创建发射器
const settingsEmitter = SettingsModuleModule
  ? new NativeEventEmitter(NativeModules.SettingsModuleModule)
  : null;

// 货币变更事件监听函数类型
type CurrencyChangeListener = (currency: string) => void;

// 模拟模块 - 当原生模块不可用时使用
const mockModule: WalletSettingsModuleType = {
  async toggleCurrency() {
    console.warn('使用模拟的钱包设置模块 - toggleCurrency');
    return 'USD';
  },
  async getCurrency() {
    console.warn('使用模拟的钱包设置模块 - getCurrency');
    return 'USD';
  },
  async setCurrency(currency: string) {
    console.warn('使用模拟的钱包设置模块 - setCurrency', currency);
    return currency;
  },
  async openSettingsPage() {
    console.warn('使用模拟的钱包设置模块 - openSettingsPage');
    return false;
  }
};

// 导出钩子
export function useWalletSettingsModule() {
  // 检查原生模块是否可用
  const isModuleAvailable = !!SettingsModuleModule;
  const module = isModuleAvailable ? SettingsModuleModule : mockModule;

  // 添加货币变更事件监听器
  const addCurrencyChangeListener = (listener: CurrencyChangeListener) => {
    if (!isModuleAvailable || !settingsEmitter) {
      console.warn('原生钱包设置模块不可用，无法添加事件监听器');
      return { remove: () => {} };
    }

    const subscription = settingsEmitter.addListener(
      'onCurrencyChange',
      (event) => {
        console.log('收到货币变更事件:', event);
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
    getCurrentCurrency: module.getCurrency,
    setCurrency: module.setCurrency,
    openSettingsPage: module.openSettingsPage,
    addCurrencyChangeListener
  };
} 
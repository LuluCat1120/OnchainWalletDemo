import { NativeModulesProxy, EventEmitter } from 'expo-modules-core';

// 接口定义
interface SettingsModuleInterface {
  getCurrentCurrency: () => Promise<string>;
  setCurrency: (currency: string) => Promise<string>;
  toggleCurrency: () => Promise<string>;
  DEFAULT_CURRENCY: string;
}

// 获取原生模块
// 如果原生模块不可用，则提供一个模拟实现
class SettingsModuleMock implements SettingsModuleInterface {
  private _currency: string = 'USD';
  DEFAULT_CURRENCY: string = 'USD';

  async getCurrentCurrency(): Promise<string> {
    return this._currency;
  }

  async setCurrency(currency: string): Promise<string> {
    this._currency = currency;
    return currency;
  }

  async toggleCurrency(): Promise<string> {
    this._currency = this._currency === 'USD' ? 'HKD' : 'USD';
    return this._currency;
  }
}

// 尝试获取原生模块，如果不可用则使用模拟实现
const NativeSettingsModule = NativeModulesProxy.SettingsModule as SettingsModuleInterface | undefined;
const SettingsModule: SettingsModuleInterface = NativeSettingsModule || new SettingsModuleMock();

export default SettingsModule; 
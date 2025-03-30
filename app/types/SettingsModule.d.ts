declare module 'SettingsModule' {
  export interface SettingsModuleInterface {
    defaultCurrency: string;
    getCurrency(): Promise<string>;
    setCurrency(currency: string): Promise<string>;
    toggleCurrency(): Promise<string>;
    addListener(eventName: string, listener: (event: any) => void): { remove: () => void };
    removeListeners(count: number): void;
  }

  const SettingsModule: SettingsModuleInterface;
  export default SettingsModule;
} 
import Foundation
import ExpoModulesCore

public class WalletSettingsModule: Module {
  // 定义事件发送器
  public let currencyChangedEvent = EventEmitter()
  
  // 导出方法给JS调用
  @objc public func toggleCurrency(_ promise: Promise) {
    // 在iOS端获取当前的货币设置
    let defaults = UserDefaults.standard
    let currentCurrency = defaults.string(forKey: "fiatCurrency") ?? "USD"
    
    // 切换货币类型
    let newCurrency = currentCurrency == "USD" ? "HKD" : "USD"
    defaults.set(newCurrency, forKey: "fiatCurrency")
    
    // 发送事件通知JS端
    currencyChangedEvent([
      "currency": newCurrency
    ])
    
    // 返回新的货币类型
    promise.resolve(newCurrency)
  }
  
  // 获取当前货币设置
  @objc public func getCurrentCurrency(_ promise: Promise) {
    let defaults = UserDefaults.standard
    let currentCurrency = defaults.string(forKey: "fiatCurrency") ?? "USD"
    promise.resolve(currentCurrency)
  }
  
  // 导出给JS的模块定义
  public func definition() -> ModuleDefinition {
    Name("WalletSettingsModule")
    
    Events("onCurrencyChanged")
    
    Function("toggleCurrency", toggleCurrency)
    Function("getCurrentCurrency", getCurrentCurrency)
  }
} 
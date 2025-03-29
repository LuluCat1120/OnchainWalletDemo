import Foundation
import ExpoModulesCore

public class SettingsModuleModule: Module {
  // 存储当前货币类型
  private var currentCurrency: String = "USD"
  
  // 设置事件发射器，用于通知JS端货币变化
  private lazy var onCurrencyChangeEvent = EventEmitter<String>(name: "onCurrencyChange")
  
  // 导出常量到JS
  public func constantsToExport() -> [String: Any] {
    return [
      "defaultCurrency": "USD"
    ]
  }
  
  // 定义模块
  public func definition() -> ModuleDefinition {
    // 名称必须与JS端引用的名称一致
    Name("SettingsModule")
    
    // 导出常量
    Constants([
      "defaultCurrency": "USD"
    ])
    
    // 定义事件
    Events("onCurrencyChange")
    
    // 异步函数：获取当前货币
    AsyncFunction("getCurrency") { () -> String in
      return self.currentCurrency
    }
    
    // 异步函数：设置货币
    AsyncFunction("setCurrency") { (newCurrency: String) -> Void in
      self.currentCurrency = newCurrency
      // 发送事件通知JS端
      self.onCurrencyChangeEvent.send(newCurrency)
    }
    
    // 异步函数：切换货币
    AsyncFunction("toggleCurrency") { () -> String in
      self.currentCurrency = self.currentCurrency == "USD" ? "HKD" : "USD"
      // 发送事件通知JS端
      self.onCurrencyChangeEvent.send(self.currentCurrency)
      return self.currentCurrency
    }
  }
} 
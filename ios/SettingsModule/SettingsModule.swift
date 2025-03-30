import Foundation
import ExpoModulesCore
import UIKit

public class SettingsModuleModule: Module {
  // 定义一个私有变量来存储当前货币
  private var currentCurrency = "USD"
  
  // 模块定义
  public func definition() -> ModuleDefinition {
    // 定义模块名称
    Name("SettingsModule")
    
    // 导出常量
    Constants([
      "defaultCurrency": "USD"
    ])
    
    // 注册事件
    Events("onCurrencyChange")
    
    // 获取当前货币
    AsyncFunction("getCurrency") { () -> String in
      return self.currentCurrency
    }
    
    // 设置货币
    AsyncFunction("setCurrency") { (currency: String, promise: Promise) in
      self.currentCurrency = currency
      // 发送事件，使用字典而不是数组
      self.sendEvent("onCurrencyChange", ["currency": currency])
      promise.resolve(currency)
    }
    
    // 切换货币
    AsyncFunction("toggleCurrency") { (promise: Promise) in
      if self.currentCurrency == "USD" {
        self.currentCurrency = "HKD"
      } else {
        self.currentCurrency = "USD"
      }
      // 发送事件，使用字典而不是数组
      self.sendEvent("onCurrencyChange", ["currency": self.currentCurrency])
      promise.resolve(self.currentCurrency)
    }
    
    // Open native settings page
    AsyncFunction("openSettingsPage") { (promise: Promise) in
      DispatchQueue.main.async {
        if let rootViewController = UIApplication.shared.delegate?.window??.rootViewController {
          let settingsVC = SettingsViewController()
          settingsVC.settingsModule = self
          
          let navController = UINavigationController(rootViewController: settingsVC)
          rootViewController.present(navController, animated: true, completion: nil)
          promise.resolve(true)
        } else {
          promise.reject("NO_VIEW_CONTROLLER", "Could not find view controller to present settings")
        }
      }
    }
  }
  
  // Method to update currency from the native UI
  public func updateCurrency(_ newCurrency: String) {
    currentCurrency = newCurrency
    sendEvent("onCurrencyChange", ["currency": newCurrency])
  }
  
  // Method to get current currency for the view controller
  public func getCurrentCurrency() -> String {
    return currentCurrency
  }
}

// Native Settings View Controller
class SettingsViewController: UIViewController {
  weak var settingsModule: SettingsModuleModule?
  private var currentCurrency: String = "USD"
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Set up the view
    view.backgroundColor = .white
    title = "Settings"
    
    // Add a navigation bar close button
    navigationItem.rightBarButtonItem = UIBarButtonItem(
      title: "Close", 
      style: .done, 
      target: self, 
      action: #selector(closeSettings)
    )
    
    // Set up UI components
    setupUI()
    
    // Get current currency
    if let module = settingsModule {
      currentCurrency = module.getCurrentCurrency()
      updateUIForCurrency(currentCurrency)
    }
  }
  
  private func setupUI() {
    // Title label
    let titleLabel = UILabel()
    titleLabel.text = "Currency Settings"
    titleLabel.font = UIFont.boldSystemFont(ofSize: 18)
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    
    // Currency label
    let currencyLabel = UILabel()
    currencyLabel.text = "Currency Unit"
    currencyLabel.translatesAutoresizingMaskIntoConstraints = false
    
    // Currency value label
    let currencyValueLabel = UILabel()
    currencyValueLabel.translatesAutoresizingMaskIntoConstraints = false
    currencyValueLabel.tag = 100 // To identify later
    
    // Toggle switch
    let usdSwitch = UISwitch()
    usdSwitch.translatesAutoresizingMaskIntoConstraints = false
    usdSwitch.addTarget(self, action: #selector(switchChanged(_:)), for: .valueChanged)
    usdSwitch.tag = 101 // To identify later
    
    // USD label
    let usdLabel = UILabel()
    usdLabel.text = "Use USD"
    usdLabel.translatesAutoresizingMaskIntoConstraints = false
    
    // Toggle button
    let toggleButton = UIButton(type: .system)
    toggleButton.setTitle("Switch Currency", for: .normal)
    toggleButton.backgroundColor = UIColor(red: 0, green: 122/255, blue: 1, alpha: 1)
    toggleButton.setTitleColor(.white, for: .normal)
    toggleButton.layer.cornerRadius = 8
    toggleButton.translatesAutoresizingMaskIntoConstraints = false
    toggleButton.addTarget(self, action: #selector(toggleButtonTapped), for: .touchUpInside)
    
    // Info label
    let infoLabel = UILabel()
    infoLabel.text = "Switching currency will change the display currency for all asset values in the app."
    infoLabel.numberOfLines = 0
    infoLabel.textColor = .gray
    infoLabel.font = UIFont.systemFont(ofSize: 14)
    infoLabel.translatesAutoresizingMaskIntoConstraints = false
    
    // Add subviews
    view.addSubview(titleLabel)
    view.addSubview(currencyLabel)
    view.addSubview(currencyValueLabel)
    view.addSubview(usdLabel)
    view.addSubview(usdSwitch)
    view.addSubview(toggleButton)
    view.addSubview(infoLabel)
    
    // Set constraints
    NSLayoutConstraint.activate([
      titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
      titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      
      currencyLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 30),
      currencyLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      
      currencyValueLabel.centerYAnchor.constraint(equalTo: currencyLabel.centerYAnchor),
      currencyValueLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      
      usdLabel.topAnchor.constraint(equalTo: currencyLabel.bottomAnchor, constant: 30),
      usdLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      
      usdSwitch.centerYAnchor.constraint(equalTo: usdLabel.centerYAnchor),
      usdSwitch.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      
      toggleButton.topAnchor.constraint(equalTo: usdLabel.bottomAnchor, constant: 30),
      toggleButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      toggleButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      toggleButton.heightAnchor.constraint(equalToConstant: 44),
      
      infoLabel.topAnchor.constraint(equalTo: toggleButton.bottomAnchor, constant: 30),
      infoLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      infoLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
    ])
  }
  
  private func updateUIForCurrency(_ currency: String) {
    if let valueLabel = view.viewWithTag(100) as? UILabel {
      valueLabel.text = currency == "USD" ? "USD ($)" : "HKD (HK$)"
      valueLabel.textColor = UIColor(red: 0, green: 122/255, blue: 1, alpha: 1)
    }
    
    if let usdSwitch = view.viewWithTag(101) as? UISwitch {
      usdSwitch.isOn = currency == "USD"
    }
  }
  
  @objc private func switchChanged(_ sender: UISwitch) {
    let newCurrency = sender.isOn ? "USD" : "HKD"
    updateCurrency(newCurrency)
  }
  
  @objc private func toggleButtonTapped() {
    let newCurrency = currentCurrency == "USD" ? "HKD" : "USD"
    updateCurrency(newCurrency)
  }
  
  @objc private func closeSettings() {
    dismiss(animated: true, completion: nil)
  }
  
  private func updateCurrency(_ newCurrency: String) {
    currentCurrency = newCurrency
    updateUIForCurrency(newCurrency)
    
    // Update the module
    settingsModule?.updateCurrency(newCurrency)
  }
} 
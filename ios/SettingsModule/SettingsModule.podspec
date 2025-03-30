require 'json'

Pod::Spec.new do |s|
  s.name           = 'SettingsModule'
  s.version        = '1.0.0'
  s.summary        = 'Settings Module for OnchainWalletDemoExpo'
  s.description    = 'Native module for handling currency settings in the wallet app'
  s.license        = { :type => 'MIT' }
  s.authors        = { 'YourName' => 'your.email@example.com' }
  s.homepage       = 'https://github.com/yourusername/yourproject'
  s.platform       = :ios, '15.0'
  s.swift_version  = '5.0'
  s.source         = { :git => 'https://github.com/yourusername/yourproject.git', :tag => s.version.to_s }
  s.source_files   = '*.{h,m,swift}'
  s.dependency 'ExpoModulesCore'
  s.module_name    = 'SettingsModuleModule'
end 
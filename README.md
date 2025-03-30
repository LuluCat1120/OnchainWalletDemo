# OnchainWalletDemoExpo - 区块链钱包演示

这是一个使用 Expo 和 React Native 开发的区块链钱包演示应用，支持显示加密货币资产、切换货币单位等功能。

## 功能特色

- 🔒 支持多种加密货币资产展示（BTC、ETH、DOGE等）
- 💱 支持货币单位切换（USD / HKD）
- 📊 资产价值自动格式化显示（K/M/B）
- 🔗 集成原生设置模块
- 📱 优化的移动端UI设计

## 快速开始

### 环境要求

- Node.js 18+
- Xcode 14+ (iOS开发)
- Android Studio (Android开发)
- npm 或 yarn

### 安装步骤

1. 克隆项目到本地

   ```bash
   git clone https://github.com/your-username/OnchainWalletDemoExpo.git
   cd OnchainWalletDemoExpo
   ```

2. 安装依赖包

   ```bash
   npm install
   ```

3. 启动应用

   ```bash
   # 普通启动
   npm run ios
   
   # 如果遇到网络问题，请使用以下命令清理缓存并重启
   sh cleanAndStart.sh
   ```

## 常见问题解决

如果遇到"fetch failed"或加载问题，请尝试：

1. 清理缓存
   ```bash
   # 清理缓存
   rm -rf node_modules/.cache
   watchman watch-del-all
   ```

2. 使用提供的脚本一键清理和启动
   ```bash
   sh cleanAndStart.sh
   ```

## 项目结构

```
app/             # 主应用代码
├── (tabs)       # 底部标签页
│   ├── assets.tsx    # 资产页面
│   └── ...
├── settings.tsx  # 设置页面
hooks/           # React钩子
├── useCurrencyContext.tsx  # 货币上下文
├── useWalletSettingsModule.tsx  # 钱包设置模块
ios/             # iOS原生代码
├── SettingsModule  # 原生设置模块
utils/           # 工具函数
├── CurrencyParser.ts  # 货币格式化工具
```

## 学习资源

- [Expo 文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/docs/getting-started)

## 贡献指南

欢迎提交 Pull Request 或提出 Issue 来帮助改进这个项目！

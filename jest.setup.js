// 模拟FormData（React Native环境中缺少）
global.FormData = class FormData {
  append() {}
};

// 模拟fetch API
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  blob: () => Promise.resolve(new Blob()),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  ok: true,
  status: 200,
  headers: new Map(),
}));

// Mock AsyncStorage globally
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve()),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  router: {
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  Link: 'Link',
  Redirect: 'Redirect',
  Stack: {
    Screen: 'Stack.Screen',
  },
  Tabs: {
    Screen: 'Tabs.Screen',
  },
}));

// Mock Expo Status Bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock Expo Asset
jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Expo Font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  Font: {
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(() => Promise.resolve()),
    processFontFamily: jest.fn(fontFamily => fontFamily),
  }
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const actualIcons = jest.requireActual('@expo/vector-icons');
  
  // 创建Mock组件
  const createMockComponent = name => {
    const component = ({ name, size, color, style }) => null;
    component.displayName = name;
    return component;
  };
  
  return {
    AntDesign: createMockComponent('AntDesign'),
    Entypo: createMockComponent('Entypo'),
    EvilIcons: createMockComponent('EvilIcons'),
    Feather: createMockComponent('Feather'),
    FontAwesome: createMockComponent('FontAwesome'),
    FontAwesome5: createMockComponent('FontAwesome5'),
    Fontisto: createMockComponent('Fontisto'),
    Foundation: createMockComponent('Foundation'),
    Ionicons: createMockComponent('Ionicons'),
    MaterialCommunityIcons: createMockComponent('MaterialCommunityIcons'),
    MaterialIcons: createMockComponent('MaterialIcons'),
    Octicons: createMockComponent('Octicons'),
    SimpleLineIcons: createMockComponent('SimpleLineIcons'),
    Zocial: createMockComponent('Zocial'),
    createIconSet: () => createMockComponent('CustomIcon'),
  };
});

// Mock Expo SplashScreen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Native Modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.NativeModules.SettingsModuleModule = {
    getCurrency: jest.fn(() => Promise.resolve('USD')),
    setCurrency: jest.fn(() => Promise.resolve()),
    toggleCurrency: jest.fn(() => Promise.resolve('HKD')),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    constantsToExport: jest.fn(() => ({ DEFAULT_CURRENCY: 'USD' })),
  };
  
  return RN;
});

// Suppress React Native warnings during tests
jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: jest.fn(),
}));

// mock the native event emitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Additional required global DOM elements for React Native
global.window = global;
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn(); 
import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, FlatList, Pressable, View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import JSON data
import currencyData from '../../assets/data/Currency.json';
import usdRateData from '../../assets/data/Fiat_rate_usd.json';
import hkdRateData from '../../assets/data/Fiat_rate_hkd.json';

// Storage key for currency setting - must match the key used in settings.tsx
const CURRENCY_STORAGE_KEY = 'app_currency_setting';

// Cryptocurrency icon color mapping
const colorMap: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  CRO: '#103F68',
  SOL: '#00FFA3',
  MATIC: '#8247E5',
  ATOM: '#2E3148',
  DOGE: '#C2A633'
};

// Generate random 24-hour change
const getRandomChange = () => {
  // Generate random number between -10% and 10%
  return (Math.random() * 20 - 10).toFixed(2);
};

// Pre-generate change percentages for each coin
const priceChanges: Record<number, string> = {};

// Initialize change percentages for all coins
currencyData.currencies?.forEach(currency => {
  priceChanges[currency.id] = getRandomChange();
});

// Load cryptocurrency data from JSON files
const loadCryptoData = () => {
  const currencies = currencyData.currencies || [];
  const usdRates = usdRateData.rates || [];
  const hkdRates = hkdRateData.rates || [];
  
  // Process USD data
  const usdData = currencies.map(currency => {
    // Find corresponding rate info
    const rateInfo = usdRates.find(rate => rate.id === currency.id);
    
    // If rate info found, calculate total value
    const fiatRate = rateInfo ? rateInfo.fiat_rate : '0';
    const fiatValue = (parseFloat(fiatRate) * currency.amount).toString();
    
    return {
      ...currency,
      fiatRate,
      fiatValue,
      priceChange: priceChanges[currency.id] || '0.00',
      color: colorMap[currency.symbol] || '#888888'
    };
  });
  
  // Process HKD data
  const hkdData = currencies.map(currency => {
    // Find corresponding rate info
    const rateInfo = hkdRates.find(rate => rate.id === currency.id);
    
    // If rate info found, calculate total value
    const fiatRate = rateInfo ? rateInfo.fiat_rate : '0';
    const fiatValue = (parseFloat(fiatRate) * currency.amount).toString();
    
    return {
      ...currency,
      fiatRate,
      fiatValue,
      priceChange: priceChanges[currency.id] || '0.00',
      color: colorMap[currency.symbol] || '#888888'
    };
  });
  
  return { usdData, hkdData };
};

export default function AssetsScreen() {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Crypto');
  const [currencyType, setCurrencyType] = useState('USD');
  const [cryptoData, setCryptoData] = useState<any[]>([]);

  // Check for settings changes when component is focused
  useEffect(() => {
    const checkSettings = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
        if (savedCurrency && savedCurrency !== currencyType) {
          console.log("Loading saved currency from storage:", savedCurrency);
          setCurrencyType(savedCurrency);
        }
      } catch (error) {
        console.error("Failed to load currency setting:", error);
      }
    };
    
    // Check currency settings when component mounts
    checkSettings();
    
    // Set interval to periodically check for currency changes
    const intervalId = setInterval(checkSettings, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currencyType]);

  // Load data
  useEffect(() => {
    // Simulate network request delay
    const timer = setTimeout(() => {
      const { usdData, hkdData } = loadCryptoData();
      setCryptoData(currencyType === 'USD' ? usdData : hkdData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update data when currency type changes
  useEffect(() => {
    if (!isLoading) {
      const { usdData, hkdData } = loadCryptoData();
      setCryptoData(currencyType === 'USD' ? usdData : hkdData);
    }
  }, [currencyType, isLoading]);

  // Tab component
  const TabBar = () => {
    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {['Crypto', 'Earn', 'NFTs'].map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  // Action buttons component
  const ActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <View style={styles.actionButton}>
        <View style={styles.actionButtonIcon}>
          <MaterialIcons name="add" size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionButtonText}>Buy</Text>
      </View>
      <View style={styles.actionButton}>
        <View style={styles.actionButtonIcon}>
          <MaterialIcons name="send" size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionButtonText}>Send</Text>
      </View>
      <View style={styles.actionButton}>
        <View style={styles.actionButtonIcon}>
          <MaterialIcons name="download" size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionButtonText}>Receive</Text>
      </View>
      <View style={styles.actionButton}>
        <View style={styles.actionButtonIcon}>
          <MaterialIcons name="spa" size={24} color="#007AFF" />
        </View>
        <Text style={styles.actionButtonText}>Earn</Text>
      </View>
    </View>
  );

  // Toggle currency type
  const toggleCurrency = () => {
    setCurrencyType(prev => prev === 'USD' ? 'HKD' : 'USD');
  };

  // Render asset item
  const renderAssetItem = ({ item }: { item: any }) => {
    const change = item.priceChange;
    const isNegative = parseFloat(change) < 0;
    
    // Show correct currency symbol based on currency type
    const currencySymbol = currencyType === 'USD' ? '$' : 'HK$';
    
    // Format value display
    const formatValue = (value: string) => {
      const numValue = parseFloat(value);
      if (numValue >= 1000000) {
        return `${(numValue / 1000000).toFixed(2)}M`;
      } else if (numValue >= 1000) {
        return `${(numValue / 1000).toFixed(2)}K`;
      }
      return numValue.toFixed(2);
    };
    
    return (
      <View style={styles.assetItemContainer}>
        <View style={styles.assetItem}>
          <View style={styles.assetLeft}>
            <View style={[styles.assetIcon, {backgroundColor: item.color}]}>
              <Text style={styles.assetIconText}>{item.symbol.charAt(0)}</Text>
            </View>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
              <Text style={[styles.assetChange, isNegative ? styles.negativeChange : styles.positiveChange]}>
                {isNegative ? '' : '+' }{change}%
              </Text>
            </View>
          </View>
          <View style={styles.assetRight}>
            <Text style={styles.assetValue}>{currencySymbol} {formatValue(item.fiatValue)}</Text>
            <Text style={styles.assetAmount}>{item.amount} {item.symbol}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Wallet header component
  const WalletHeader = () => (
    <View style={styles.walletHeader}>
      <View style={styles.walletLeft}>
        <View style={styles.walletAvatar}>
          <Text style={styles.walletAvatarText}>W</Text>
        </View>
        <Text style={styles.walletName}>Wallet 1</Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
      </View>
      <View style={styles.walletActions}>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="fullscreen" size={24} color="#999999" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="history" size={24} color="#999999" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => router.navigate('/settings')}>
          <MaterialIcons name="settings" size={24} color="#999999" />
        </Pressable>
      </View>
    </View>
  );

  // Network selector component
  const NetworkSelector = () => (
    <View style={styles.networkSelector}>
      <Text style={styles.networkText}>All Mainnets</Text>
      <MaterialIcons name="keyboard-arrow-down" size={16} color="#999999" />
    </View>
  );

  // Balance display component
  const BalanceDisplay = () => (
    <View style={styles.balanceDisplay}>
      <MaterialIcons name="visibility" size={24} color="#999999" />
      <Text style={styles.balanceDash}>- - • - -</Text>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading assets...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WalletHeader />
      <NetworkSelector />
      <BalanceDisplay />
      <ActionButtons />
      <TabBar />
      
      <View style={styles.assetsContainer}>
        <View style={styles.assetsHeader}>
          <Text style={styles.assetsTitle}>Your Assets</Text>
          <View style={styles.manageButton}>
            <Text style={styles.manageText}>Manage</Text>
            <MaterialIcons name="tune" size={18} color="#007AFF" />
          </View>
        </View>
        
        {activeTab === 'Crypto' && (
          <FlatList
            data={cryptoData}
            renderItem={renderAssetItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        )}
        
        {activeTab !== 'Crypto' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab} data available</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#F5F5F5',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  walletAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  walletAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  walletName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
  walletActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  networkSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  networkText: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
  },
  balanceDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  balanceDash: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  tabBarContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  assetsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  assetsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  assetsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageText: {
    color: '#007AFF',
    fontSize: 16,
    marginRight: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  assetItemContainer: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assetInfo: {
    justifyContent: 'center',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetChange: {
    fontSize: 14,
  },
  positiveChange: {
    color: '#4CD964',
  },
  negativeChange: {
    color: '#FF3B30',
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetAmount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  currencyToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 16,
  },
  currencyText: {
    fontWeight: '600',
  },
}); 
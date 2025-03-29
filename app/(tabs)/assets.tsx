import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Pressable, View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// 加载模拟数据
const loadCryptoData = () => {
  // 模拟资产数据
  const usdData = [
    {
      id: 1,
      name: 'bitcoin',
      symbol: 'BTC',
      amount: 2.1,
      fiatValue: '126000',
      fiatRate: '60000',
      color: '#F7931A'
    },
    {
      id: 2,
      name: 'ethereum',
      symbol: 'ETH',
      amount: 10.8,
      fiatValue: '36180',
      fiatRate: '3350',
      color: '#627EEA'
    },
    {
      id: 3,
      name: 'cronos',
      symbol: 'CRO',
      amount: 12345,
      fiatValue: '1111.05',
      fiatRate: '0.09',
      color: '#103F68'
    },
    {
      id: 4,
      name: 'solana',
      symbol: 'SOL',
      amount: 98,
      fiatValue: '13034',
      fiatRate: '133',
      color: '#00FFA3'
    },
    {
      id: 5,
      name: 'polygon',
      symbol: 'MATIC',
      amount: 0.9,
      fiatValue: '0.504',
      fiatRate: '0.56',
      color: '#8247E5'
    },
    {
      id: 6,
      name: 'cosmos',
      symbol: 'ATOM',
      amount: 100,
      fiatValue: '694',
      fiatRate: '6.94',
      color: '#2E3148'
    },
    {
      id: 7,
      name: 'dogecoin',
      symbol: 'DOGE',
      amount: 1000,
      fiatValue: '120',
      fiatRate: '0.12',
      color: '#C2A633'
    }
  ];

  const hkdData = usdData.map(item => {
    // 将USD转换为HKD，简单起见，这里使用固定的换算率（1 USD = 7.8 HKD）
    const hkdRate = (parseFloat(item.fiatRate) * 7.8).toString();
    const hkdValue = (parseFloat(item.fiatValue) * 7.8).toString();
    return {
      ...item,
      fiatRate: hkdRate,
      fiatValue: hkdValue
    };
  });

  return { usdData, hkdData };
};

// 随机生成24小时变化率
const getRandomChange = () => {
  // 生成-10%到10%之间的随机数
  return (Math.random() * 20 - 10).toFixed(2);
};

export default function AssetsScreen() {
  // 状态
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Crypto');
  const [currencyType, setCurrencyType] = useState('USD');
  const [cryptoData, setCryptoData] = useState<any[]>([]);

  // 加载数据
  useEffect(() => {
    // 模拟网络请求延迟
    const timer = setTimeout(() => {
      const { usdData, hkdData } = loadCryptoData();
      setCryptoData(currencyType === 'USD' ? usdData : hkdData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 切换货币类型时更新数据
  useEffect(() => {
    if (!isLoading) {
      const { usdData, hkdData } = loadCryptoData();
      setCryptoData(currencyType === 'USD' ? usdData : hkdData);
    }
  }, [currencyType, isLoading]);

  // 标签组件
  const TabBar = () => {
    return (
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
    );
  };

  // 切换货币类型
  const toggleCurrency = () => {
    setCurrencyType(prev => prev === 'USD' ? 'HKD' : 'USD');
  };

  // 渲染资产项目
  const renderAssetItem = ({ item }: { item: any }) => {
    const change = getRandomChange();
    const isNegative = parseFloat(change) < 0;
    
    // 格式化价值显示
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
          <Text style={styles.assetValue}>{currencyType} {formatValue(item.fiatValue)}</Text>
          <Text style={styles.assetAmount}>{item.amount} {item.symbol}</Text>
        </View>
      </View>
    );
  };

  // 顶部钱包信息
  const WalletHeader = () => (
    <View style={styles.walletHeader}>
      <View style={styles.walletLeft}>
        <View style={styles.walletAvatar}>
          <Text style={styles.walletAvatarText}>W</Text>
        </View>
        <Text style={styles.walletName}>Wallet 1</Text>
      </View>
      <Pressable onPress={toggleCurrency} style={styles.currencyToggle}>
        <Text style={styles.currencyText}>{currencyType}</Text>
      </Pressable>
    </View>
  );

  // 加载中状态
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
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Assets</Text>
        <View style={styles.headerActions}>
          <Text style={styles.totalValue}>{currencyType} {
            cryptoData.reduce((total, item) => total + parseFloat(item.fiatValue), 0).toLocaleString()
          }</Text>
        </View>
      </View>
      
      <TabBar />
      
      {activeTab === 'Crypto' && (
        <FlatList
          data={cryptoData}
          renderItem={renderAssetItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}
      
      {activeTab !== 'Crypto' && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No {activeTab} data available</Text>
        </View>
      )}
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
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
}); 
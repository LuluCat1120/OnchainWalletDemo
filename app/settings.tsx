import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { View, Text } from '../components/Themed';
import { IconSymbol } from '../components/ui/IconSymbol';
import { router } from 'expo-router';
import { useCurrency } from '../hooks/useCurrencyContext';

export default function SettingsScreen() {
  const { fiatCurrency, toggleCurrency } = useCurrency();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>设置</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>货币设置</Text>
        <Pressable style={styles.option} onPress={toggleCurrency}>
          <Text style={styles.optionText}>显示货币</Text>
          <View style={styles.optionRight}>
            <Text style={styles.optionValue}>{fiatCurrency}</Text>
            <IconSymbol name="chevron.right" size={20} color="#8E8E93" />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>版本</Text>
          <Text style={styles.optionValue}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  optionText: {
    fontSize: 16,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
}); 
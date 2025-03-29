import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="assets"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerTitle: '',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          headerShown: false,
          headerTitle: '',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-balance-wallet" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // 禁用这个标签页的路由
        }}
      />
    </Tabs>
  );
}

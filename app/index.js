import { Redirect } from 'expo-router';

export default function Index() {
  // 重定向到assets页面
  return <Redirect href="/(tabs)/assets" />;
} 
import { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '../store/authStore';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
              console.log('SW registered:', registration);
            })
            .catch(error => {
              console.log('SW registration failed:', error);
            });
        });
      }
    }
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useBackHandler } from '@/hooks/useBackHandler';
import { UserProvider } from '../context/UserContext';
import { LocalizationProvider } from '../context/LocalizationContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../src/i18n/i18n'; // Initialize i18n

function RootLayoutContent() {
  useFrameworkReady();
  useBackHandler(); // Handle native back gestures and hardware back button

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="flash-screen" options={{ headerShown: false }} />
        <Stack.Screen name="welcome-flash" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#2196F3" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <LocalizationProvider>
        <UserProvider>
          <RootLayoutContent />
        </UserProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
}
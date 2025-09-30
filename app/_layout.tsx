// app/_layout.tsx
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LocalizationProvider } from '../context/LocalizationContext';
import { UserProvider } from '../context/UserContext';
import { LocationWeatherProvider } from '../context/LocationWeatherContext';
import '../src/i18n/i18n';

function RootLayoutContent() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="flash-screen" options={{ headerShown: false }} />
        <Stack.Screen name="welcome-flash" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
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
          <LocationWeatherProvider>
            <RootLayoutContent />
          </LocationWeatherProvider>
        </UserProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
}

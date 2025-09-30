// app/index.js
import { Redirect, useRootNavigationState } from 'expo-router';
import { useUserContext } from '../context/UserContext';

export default function Index() {
  const { isLoggedIn } = useUserContext();
  const rootReady = (useRootNavigationState()?.key != null);

  // Wait until the root navigator is mounted
  if (!rootReady) return null;

  if (isLoggedIn) {
    // already logged in → go to main drawer
    return <Redirect href="/(drawer)" />;
  }

  // not logged in → go to login
  return <Redirect href="/login" />;
}

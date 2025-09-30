// app/(drawer)/index.tsx
import { Redirect } from 'expo-router';

export default function DrawerIndex() {
  return <Redirect href="/(tabs)" />;
}

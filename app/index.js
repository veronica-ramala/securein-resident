import { Redirect } from 'expo-router';

export default function Index() {
  // Always start from splash screen first
  return <Redirect href="/flash-screen" />;
}
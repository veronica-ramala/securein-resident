import { Redirect } from 'expo-router';

export default function Index() {
  // Always start from login page
  return <Redirect href="/login" />;
}
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

// Define the main tab routes
const TAB_ROUTES = ['/', '/services', '/profile'];

// Define which screens should navigate to which tab when back is pressed
const SCREEN_TO_TAB_MAPPING: Record<string, string> = {
  '/add-visitor': '/',
  '/my-visitors': '/',
  '/emergency': '/',
  '/requests': '/',
  '/gate': '/',
  '/store': '/services',
  '/facilities': '/services',
  '/community-map': '/services',
  '/community-services': '/services',
  '/local-connect': '/services',
  '/edit-profile': '/profile',
  '/change-password': '/profile',
  '/security': '/profile',
};

export const useBackHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      // If we're on a main tab, let the default behavior handle it (exit app)
      if (TAB_ROUTES.includes(pathname)) {
        return false;
      }

      // If we're on a sub-screen, navigate to the appropriate tab
      const targetTab = SCREEN_TO_TAB_MAPPING[pathname];
      if (targetTab) {
        router.push(targetTab as any);
        return true; // Prevent default behavior
      }

      // For any other screens, use default back behavior
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [pathname, router]);
};

// Custom navigation function that respects the tab hierarchy
export const useSmartNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateBack = () => {
    // If we're on a main tab, do nothing or exit app
    if (TAB_ROUTES.includes(pathname)) {
      BackHandler.exitApp();
      return;
    }

    // If we're on a sub-screen, navigate to the appropriate tab
    const targetTab = SCREEN_TO_TAB_MAPPING[pathname];
    if (targetTab) {
      router.push(targetTab as any);
      return;
    }

    // For any other screens, use default back behavior
    router.back();
  };

  return { navigateBack };
};
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Hook to optimize navigation performance
 * Ensures heavy operations are deferred until after navigation animations complete
 */
export const useNavigationPerformance = (callback?: () => void) => {
  useFocusEffect(() => {
    // Defer execution until after navigation animations complete
    const task = InteractionManager.runAfterInteractions(() => {
      if (callback) {
        callback();
      }
    });

    return () => task.cancel();
  });
};

/**
 * Hook to preload screen data
 * Helps reduce perceived loading time by starting data preparation early
 */
export const usePreloadScreen = (preloadFunction?: () => void | Promise<void>) => {
  useEffect(() => {
    if (preloadFunction) {
      // Run preload function after a short delay to not block current screen
      const timer = setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
          preloadFunction();
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [preloadFunction]);
};

/**
 * Hook to optimize re-renders by batching state updates
 */
export const useBatchedUpdates = () => {
  const batchUpdate = (updates: (() => void)[]) => {
    InteractionManager.runAfterInteractions(() => {
      updates.forEach(update => update());
    });
  };

  return { batchUpdate };
};
import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveDimensions {
  window: ScaledSize;
  screen: ScaledSize;
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isVerySmallDevice: boolean;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
}

export const useResponsiveDimensions = (): ResponsiveDimensions => {
  const [dimensions, setDimensions] = useState(() => {
    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');
    return { window, screen };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  const { window, screen } = dimensions;
  const { width, height } = window;

  // Device type detection based on current width
  const isVerySmallDevice = width < 350;
  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 414;
  const isLargeDevice = width >= 414;
  const isTablet = width >= 768;

  // Orientation detection
  const isPortrait = height > width;
  const isLandscape = width > height;

  return {
    window,
    screen,
    width,
    height,
    isPortrait,
    isLandscape,
    isVerySmallDevice,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
  };
};

export default useResponsiveDimensions;
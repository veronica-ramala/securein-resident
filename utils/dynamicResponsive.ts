import { PixelRatio } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Dynamic responsive utilities that work with any screen width/height
export const createResponsiveUtils = (screenWidth: number, screenHeight: number) => {
  // Responsive width and height based on current dimensions
  const wp = (percentage: number) => {
    const value = (percentage * screenWidth) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
  };

  const hp = (percentage: number) => {
    const value = (percentage * screenHeight) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
  };

  // Responsive font sizes
  const RFP = (percentage: number) => RFPercentage(percentage);
  const RF = (size: number) => RFValue(size, screenHeight);

  // Scale functions from react-native-size-matters
  const s = (size: number) => scale(size);
  const vs = (size: number) => verticalScale(size);
  const ms = (size: number, factor?: number) => moderateScale(size, factor);

  // Dynamic font size helpers based on screen width
  const getFontSizes = () => {
    const baseMultiplier = screenWidth < 350 ? 0.9 : screenWidth < 375 ? 0.95 : 1;
    
    return {
      tiny: RF(11 * baseMultiplier),
      small: RF(13 * baseMultiplier),
      medium: RF(15 * baseMultiplier),
      regular: RF(17 * baseMultiplier),
      large: RF(19 * baseMultiplier),
      xlarge: RF(21 * baseMultiplier),
      xxlarge: RF(25 * baseMultiplier),
      huge: RF(29 * baseMultiplier),
      massive: RF(33 * baseMultiplier),
    };
  };

  // Dynamic spacing helpers based on screen width
  const getSpacing = () => {
    const baseMultiplier = screenWidth < 350 ? 0.8 : screenWidth < 375 ? 0.9 : 1;
    
    return {
      tiny: s(4 * baseMultiplier),
      small: s(8 * baseMultiplier),
      medium: s(12 * baseMultiplier),
      regular: s(16 * baseMultiplier),
      large: s(20 * baseMultiplier),
      xlarge: s(24 * baseMultiplier),
      xxlarge: s(32 * baseMultiplier),
      huge: s(40 * baseMultiplier),
    };
  };

  // Device type detection
  const isVerySmallDevice = screenWidth < 350;
  const isSmallDevice = screenWidth < 375;
  const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
  const isLargeDevice = screenWidth >= 414;
  const isTablet = screenWidth >= 768;

  // Enhanced responsive text helpers
  const getResponsiveText = (text: string, maxLength?: number) => {
    if (!maxLength) return text;
    
    if (isSmallDevice && text.length > maxLength) {
      if (text.length > maxLength + 5) {
        return text.substring(0, maxLength - 3) + '...';
      }
    }
    return text;
  };

  // Enhanced tab label helper
  const getTabLabel = (text: string) => {
    if (isVerySmallDevice && text.length > 8) {
      const words = text.split(' ');
      if (words.length > 1) {
        return words[0].substring(0, 6);
      }
      return text.substring(0, 6);
    }
    
    if (isSmallDevice && text.length > 12) {
      const words = text.split(' ');
      if (words.length > 1) {
        if (words.length === 2 && words[0].length <= 6 && words[1].length <= 6) {
          return text;
        }
        return words[0];
      } else {
        return text.length > 10 ? text.substring(0, 9) : text;
      }
    }
    return text;
  };

  // Responsive line height
  const getLineHeight = (fontSize: number) => {
    return fontSize * 1.4;
  };

  // Container width helpers
  const getContainerWidth = (percentage: number = 100) => {
    return wp(percentage);
  };

  // Responsive padding/margin helpers
  const getHorizontalPadding = () => {
    if (isVerySmallDevice) return wp(4);
    if (isSmallDevice) return wp(5);
    if (isTablet) return wp(8);
    return wp(6);
  };

  const getVerticalPadding = () => {
    if (isVerySmallDevice) return hp(2);
    if (isSmallDevice) return hp(2.5);
    if (isTablet) return hp(4);
    return hp(3);
  };

  // Card/component sizing helpers
  const getCardWidth = (columns: number = 1, spacing: number = 16) => {
    const totalSpacing = spacing * (columns + 1);
    const availableWidth = screenWidth - totalSpacing;
    return availableWidth / columns;
  };

  const getButtonHeight = () => {
    if (isVerySmallDevice) return hp(6);
    if (isSmallDevice) return hp(6.5);
    if (isTablet) return hp(8);
    return hp(7);
  };

  return {
    wp,
    hp,
    RFP,
    RF,
    s,
    vs,
    ms,
    fontSize: getFontSizes(),
    spacing: getSpacing(),
    isVerySmallDevice,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    getResponsiveText,
    getTabLabel,
    getLineHeight,
    getContainerWidth,
    getHorizontalPadding,
    getVerticalPadding,
    getCardWidth,
    getButtonHeight,
    screenWidth,
    screenHeight,
  };
};

export default createResponsiveUtils;
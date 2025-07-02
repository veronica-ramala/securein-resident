import { Dimensions, PixelRatio } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive width and height
export const wp = (percentage: number) => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

export const hp = (percentage: number) => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font sizes
export const RFP = (percentage: number) => RFPercentage(percentage);
export const RF = (size: number) => RFValue(size, SCREEN_HEIGHT);

// Scale functions from react-native-size-matters
export const s = (size: number) => scale(size);
export const vs = (size: number) => verticalScale(size);
export const ms = (size: number, factor?: number) => moderateScale(size, factor);

// Font size helpers - improved for better readability
export const fontSize = {
  tiny: RF(11),      // Increased from 10 for better readability
  small: RF(13),     // Increased from 12
  medium: RF(15),    // Increased from 14
  regular: RF(17),   // Increased from 16
  large: RF(19),     // Increased from 18
  xlarge: RF(21),    // Increased from 20
  xxlarge: RF(25),   // Increased from 24
  huge: RF(29),      // Increased from 28
  massive: RF(33),   // Increased from 32
};

// Spacing helpers
export const spacing = {
  tiny: s(4),
  small: s(8),
  medium: s(12),
  regular: s(16),
  large: s(20),
  xlarge: s(24),
  xxlarge: s(32),
  huge: s(40),
};

// Device type detection
export const isVerySmallDevice = SCREEN_WIDTH < 350;
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;

// Responsive text helpers - improved to be less aggressive
export const getResponsiveText = (text: string, maxLength?: number) => {
  // Don't truncate unless absolutely necessary
  if (!maxLength) return text;
  
  if (isSmallDevice && text.length > maxLength) {
    // Only truncate if text is significantly longer
    if (text.length > maxLength + 5) {
      return text.substring(0, maxLength - 3) + '...';
    }
  }
  return text;
};

// Tab label helper - more flexible for tab navigation
export const getTabLabel = (text: string) => {
  // Allow longer text on tabs, only abbreviate if really necessary
  if (isSmallDevice && text.length > 12) {
    const words = text.split(' ');
    if (words.length > 1) {
      // Multi-word: use abbreviation or first word
      if (words.length === 2 && words[0].length <= 6 && words[1].length <= 6) {
        return text; // Keep both words if they're short
      }
      return words[0]; // Use first word
    } else {
      // Single word: only truncate if very long
      return text.length > 10 ? text.substring(0, 9) : text;
    }
  }
  return text;
};

// Responsive line height
export const getLineHeight = (fontSize: number) => {
  return fontSize * 1.4; // 1.4 is a good ratio for readability
};

export default {
  wp,
  hp,
  RFP,
  RF,
  s,
  vs,
  ms,
  fontSize,
  spacing,
  isVerySmallDevice,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  getResponsiveText,
  getTabLabel,
  getLineHeight,
};
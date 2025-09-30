import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { fontSize, getLineHeight, getResponsiveText, isSmallDevice } from '../utils/responsive';
import { useResponsive } from './ResponsiveWrapper';

interface ResponsiveTextProps extends TextProps {
  size?: 'tiny' | 'small' | 'medium' | 'regular' | 'large' | 'xlarge' | 'xxlarge' | 'huge' | 'massive';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  maxLength?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
  useDynamicSizing?: boolean; // New prop to use dynamic responsive sizing
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'regular',
  weight = 'normal',
  color = '#000000',
  maxLength,
  adjustsFontSizeToFit = true,
  minimumFontScale = 0.8,
  useDynamicSizing = false,
  style,
  ...props
}) => {
  // Try to use dynamic responsive context, fallback to static utils
  let textSize, lineHeight, processedText, isSmallDeviceCheck;
  
  try {
    if (useDynamicSizing) {
      const { responsive } = useResponsive();
      textSize = responsive.fontSize[size];
      lineHeight = responsive.getLineHeight(textSize);
      processedText = typeof children === 'string' && maxLength 
        ? responsive.getResponsiveText(children, maxLength)
        : children;
      isSmallDeviceCheck = responsive.isSmallDevice;
    } else {
      throw new Error('Use static sizing');
    }
  } catch {
    // Fallback to static responsive utilities
    textSize = fontSize[size];
    lineHeight = getLineHeight(textSize);
    processedText = typeof children === 'string' && maxLength 
      ? getResponsiveText(children, maxLength)
      : children;
    isSmallDeviceCheck = isSmallDevice;
  }

  const textStyle = [
    {
      fontSize: textSize,
      lineHeight: lineHeight,
      fontWeight: weight,
      color: color,
    },
    isSmallDeviceCheck && styles.smallDeviceText,
    style,
  ];

  return (
    <Text
      style={textStyle}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      numberOfLines={props.numberOfLines}
      {...props}
    >
      {processedText}
    </Text>
  );
};

const styles = StyleSheet.create({
  smallDeviceText: {
    // Additional adjustments for small devices
    letterSpacing: -0.2,
  },
});

export default ResponsiveText;
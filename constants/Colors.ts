/**
 * Color theme configuration for SecureIn Community App
 * Updated to match brand logo colors
 */

export const Colors = {
  // Primary colors - Brand palette
  primary: '#1E88E5', // Medium blue for primary buttons and action triggers
  primaryLight: '#4DD0E1', // Teal blue for icons and icon-accented buttons
  primaryDark: '#2196F3', // Bright blue for headers and top navigation
  
  // Secondary colors (derived from primary)
  secondary: '#F5F9FF', // Soft bluish-white for general screen backgrounds
  accent: '#4DD0E1', // Teal blue for accents and icons
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF5350', // Calm red for error messages, validation borders, and delete buttons
  info: '#2196F3',
  
  // Neutral colors
  white: '#FFFFFF', // For card backgrounds, modal surfaces, form inputs, and text containers
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background colors
  background: {
    primary: '#F5F9FF', // Soft bluish-white for general screen backgrounds
    secondary: '#FFFFFF', // White for card backgrounds
    card: '#FFFFFF', // White for card backgrounds, modal surfaces, form inputs
    overlay: 'rgba(33, 150, 243, 0.1)', // Updated overlay with header color
  },
  
  // Text colors
  text: {
    primary: '#1E88E5', // Medium blue for primary text
    secondary: '#4B5563',
    light: '#6B7280',
    white: '#FFFFFF',
    placeholder: '#AAAAAA',
  },
  
  // Border colors
  border: {
    light: '#DDDBCB',
    medium: 'rgba(0, 0, 0, 0.08)',
    primary: '#1E88E5', // Medium blue for primary borders
  },
  
  // Brand-specific color mappings
  brand: {
    background: '#F5F9FF', // Soft bluish-white
    header: '#2196F3', // Bright blue for headers
    icons: '#4DD0E1', // Teal blue for icons
    buttons: '#1E88E5', // Medium blue for buttons
    error: '#EF5350', // Calm red for errors
    white: '#FFFFFF', // Pure white
  },
  
  // Legacy color mappings (for easy replacement)
  legacy: {
    oldPrimary: '#125E8A',
    oldSecondary: '#89AAE6',
    oldHeader: '#0077B6',
  }
};

export default Colors;
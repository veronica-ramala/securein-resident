/**
 * Color theme configuration for SecureIn Community App
 * Primary color: #0077B6 (Ocean Blue)
 */

export const Colors = {
  // Primary colors
  primary: '#0077B6',
  primaryLight: '#90CAF9', // Lighter shade for gradients and secondary elements
  primaryDark: '#005A8B', // Darker shade for emphasis
  
  // Secondary colors (derived from primary)
  secondary: '#B3E5FC', // Very light blue for backgrounds
  accent: '#0288D1', // Slightly different blue for accents
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0077B6',
  
  // Neutral colors
  white: '#FFFFFF',
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
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    card: '#FFFFFF',
    overlay: 'rgba(0, 119, 182, 0.1)',
  },
  
  // Text colors
  text: {
    primary: '#0077B6',
    secondary: '#4B5563',
    light: '#6B7280',
    white: '#FFFFFF',
    placeholder: '#AAAAAA',
  },
  
  // Border colors
  border: {
    light: '#DDDBCB',
    medium: 'rgba(0, 0, 0, 0.08)',
    primary: '#0077B6',
  },
  
  // Legacy color mappings (for easy replacement)
  legacy: {
    oldPrimary: '#125E8A',
    oldSecondary: '#89AAE6',
  }
};

export default Colors;
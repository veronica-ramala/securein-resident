# Responsive Implementation Guide

This guide shows you how to apply `Dimensions.get("window").width` across all screens and components while retaining your existing code.

## Overview

The new responsive system provides:
- **Dynamic screen width/height detection** with orientation change support
- **Responsive utilities** that adapt to current screen dimensions
- **Easy-to-use wrapper components** for consistent responsive behavior
- **Backward compatibility** with your existing responsive utilities

## Quick Start

### 1. Basic Screen Conversion

**Before (your current approach):**
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { wp, hp, fontSize, spacing } from '../../utils/responsive';

export default function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <ScrollView style={{ paddingHorizontal: wp(6) }}>
        <Text style={{ fontSize: fontSize.large, marginBottom: spacing.medium }}>
          Welcome
        </Text>
        {/* Your existing content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

**After (with new responsive system):**
```tsx
import { ResponsiveWrapper, useResponsive } from '../../components/ResponsiveWrapper';
import { ResponsiveText } from '../../components/ResponsiveText';

export default function MyScreen() {
  return (
    <ResponsiveWrapper 
      useSafeArea={true}
      backgroundColor="#F8F9FA"
      horizontalPadding={true}
    >
      <ScrollView>
        <ResponsiveText 
          size="large" 
          useDynamicSizing={true}
          style={{ marginBottom: 16 }}
        >
          Welcome
        </ResponsiveText>
        {/* Your existing content - now automatically responsive */}
      </ScrollView>
    </ResponsiveWrapper>
  );
}
```

### 2. Using Responsive Utilities in Components

```tsx
const MyComponent = () => {
  const { responsive, dimensions } = useResponsive();
  
  return (
    <View style={{
      width: responsive.wp(100), // Full width
      height: responsive.hp(20),  // 20% of screen height
      padding: responsive.spacing.medium,
      marginBottom: responsive.spacing.large,
      // Conditional styling based on device type
      flexDirection: dimensions.isTablet ? 'row' : 'column',
    }}>
      <ResponsiveText 
        size={dimensions.isTablet ? "xlarge" : "large"}
        useDynamicSizing={true}
      >
        Dynamic Text Size
      </ResponsiveText>
    </View>
  );
};
```

## Step-by-Step Implementation

### Step 1: Update Your Imports

Add these imports to screens you want to make responsive:

```tsx
import { 
  ResponsiveWrapper, 
  ResponsiveView, 
  ResponsiveCard, 
  ResponsiveButton,
  useResponsive 
} from '../../components/ResponsiveWrapper';
import { ResponsiveText } from '../../components/ResponsiveText';
```

### Step 2: Wrap Your Screen Content

Replace your existing SafeAreaView/View wrapper:

```tsx
// Replace this:
<SafeAreaView style={{ flex: 1 }}>
  {/* content */}
</SafeAreaView>

// With this:
<ResponsiveWrapper useSafeArea={true}>
  {/* content */}
</ResponsiveWrapper>
```

### Step 3: Convert Text Components

```tsx
// Replace this:
<Text style={{ fontSize: fontSize.large, color: '#333' }}>
  My Text
</Text>

// With this:
<ResponsiveText 
  size="large" 
  color="#333"
  useDynamicSizing={true}
>
  My Text
</ResponsiveText>
```

### Step 4: Use Responsive Utilities

```tsx
const MyComponent = () => {
  const { responsive, dimensions } = useResponsive();
  
  return (
    <View style={{
      // Dynamic width based on screen size
      width: responsive.getContainerWidth(90), // 90% of screen width
      
      // Dynamic padding based on device type
      paddingHorizontal: responsive.getHorizontalPadding(),
      paddingVertical: responsive.getVerticalPadding(),
      
      // Dynamic spacing
      marginBottom: responsive.spacing.large,
      
      // Conditional layout for tablets vs phones
      flexDirection: dimensions.isTablet ? 'row' : 'column',
      
      // Dynamic card width for grids
      width: responsive.getCardWidth(2, 16), // 2 columns with 16px spacing
    }}>
      {/* Content */}
    </View>
  );
};
```

## Available Responsive Components

### 1. ResponsiveWrapper
Main wrapper for screens:

```tsx
<ResponsiveWrapper 
  useSafeArea={true}           // Use SafeAreaView
  backgroundColor="#F8F9FA"    // Background color
  horizontalPadding={true}     // Auto horizontal padding
  verticalPadding={false}      // Auto vertical padding
  customPadding={{             // Custom padding
    top: 20,
    bottom: 10,
    left: 16,
    right: 16
  }}
>
  {/* Your content */}
</ResponsiveWrapper>
```

### 2. ResponsiveView
Responsive container:

```tsx
<ResponsiveView 
  width={90}        // 90% of screen width
  height={20}       // 20% of screen height
  padding={1}       // Apply padding
  margin={1}        // Apply margin
>
  {/* Content */}
</ResponsiveView>
```

### 3. ResponsiveCard
Card component with responsive sizing:

```tsx
<ResponsiveCard 
  columns={2}       // For 2-column grid
  spacing={16}      // Spacing between cards
>
  {/* Card content */}
</ResponsiveCard>
```

### 4. ResponsiveText
Enhanced text component:

```tsx
<ResponsiveText 
  size="large"              // Size from fontSize scale
  weight="600"              // Font weight
  color="#333333"           // Text color
  useDynamicSizing={true}   // Use dynamic responsive sizing
  maxLength={50}            // Auto-truncate on small devices
>
  Your text content
</ResponsiveText>
```

### 5. ResponsiveButton
Button with responsive sizing:

```tsx
<ResponsiveButton 
  fullWidth={true}  // Full width button
>
  <TouchableOpacity>
    <ResponsiveText size="medium" color="#FFFFFF">
      Button Text
    </ResponsiveText>
  </TouchableOpacity>
</ResponsiveButton>
```

## Available Responsive Utilities

When you use `useResponsive()` hook, you get access to:

### Dimensions
```tsx
const { dimensions } = useResponsive();

dimensions.width          // Current screen width
dimensions.height         // Current screen height
dimensions.isPortrait     // Is device in portrait mode
dimensions.isLandscape    // Is device in landscape mode
dimensions.isTablet       // Is device a tablet (width >= 768)
dimensions.isSmallDevice  // Is small device (width < 375)
dimensions.isLargeDevice  // Is large device (width >= 414)
```

### Responsive Functions
```tsx
const { responsive } = useResponsive();

// Percentage-based sizing
responsive.wp(50)         // 50% of screen width
responsive.hp(25)         // 25% of screen height

// Font sizes (automatically scaled)
responsive.fontSize.small
responsive.fontSize.medium
responsive.fontSize.large
// ... etc

// Spacing (automatically scaled)
responsive.spacing.small
responsive.spacing.medium
responsive.spacing.large
// ... etc

// Helper functions
responsive.getContainerWidth(90)        // 90% container width
responsive.getHorizontalPadding()       // Smart horizontal padding
responsive.getVerticalPadding()         // Smart vertical padding
responsive.getCardWidth(2, 16)          // Width for 2-column grid with 16px spacing
responsive.getButtonHeight()            // Responsive button height
```

## Migration Examples

### Example 1: Simple Screen

**Before:**
```tsx
export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ paddingHorizontal: wp(6) }}>
        <Text style={{ fontSize: fontSize.xlarge, fontWeight: 'bold' }}>
          Profile
        </Text>
        <View style={{ marginTop: spacing.large }}>
          {/* Profile content */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

**After:**
```tsx
export default function ProfileScreen() {
  return (
    <ResponsiveWrapper 
      useSafeArea={true}
      backgroundColor="#FFFFFF"
      horizontalPadding={true}
    >
      <ScrollView>
        <ResponsiveText 
          size="xlarge" 
          weight="bold"
          useDynamicSizing={true}
        >
          Profile
        </ResponsiveText>
        <ResponsiveView style={{ marginTop: 20 }}>
          {/* Profile content */}
        </ResponsiveView>
      </ScrollView>
    </ResponsiveWrapper>
  );
}
```

### Example 2: Grid Layout

**Before:**
```tsx
const ServicesGrid = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {services.map(service => (
        <View 
          key={service.id}
          style={{ 
            width: (SCREEN_WIDTH - 48) / 2, 
            margin: 8,
            padding: 16 
          }}
        >
          <Text style={{ fontSize: fontSize.medium }}>
            {service.title}
          </Text>
        </View>
      ))}
    </View>
  );
};
```

**After:**
```tsx
const ServicesGrid = () => {
  const { responsive, dimensions } = useResponsive();
  const columns = dimensions.isTablet ? 3 : 2;
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: responsive.spacing.medium }}>
      {services.map(service => (
        <ResponsiveCard 
          key={service.id}
          columns={columns}
          style={{ padding: responsive.spacing.medium }}
        >
          <ResponsiveText 
            size="medium"
            useDynamicSizing={true}
          >
            {service.title}
          </ResponsiveText>
        </ResponsiveCard>
      ))}
    </View>
  );
};
```

## Best Practices

### 1. Gradual Migration
- Start with new screens using the responsive system
- Gradually migrate existing screens one by one
- Keep your existing responsive utilities as fallback

### 2. Use Dynamic Sizing Selectively
- Use `useDynamicSizing={true}` for text that should adapt to screen changes
- Keep `useDynamicSizing={false}` (default) for text that should remain consistent

### 3. Leverage Device Type Detection
```tsx
const MyComponent = () => {
  const { dimensions, responsive } = useResponsive();
  
  return (
    <View style={{
      // Different layouts for different device types
      flexDirection: dimensions.isTablet ? 'row' : 'column',
      padding: dimensions.isSmallDevice ? responsive.spacing.small : responsive.spacing.large,
    }}>
      {/* Content adapts to device type */}
    </View>
  );
};
```

### 4. Responsive Images and Icons
```tsx
const MyIcon = () => {
  const { dimensions } = useResponsive();
  
  return (
    <MyIconComponent 
      size={dimensions.isTablet ? 32 : 24}
      color="#0077B6"
    />
  );
};
```

## Testing Responsive Design

1. **Test on different screen sizes** in your simulator/emulator
2. **Test orientation changes** (portrait/landscape)
3. **Test on actual devices** with different screen sizes
4. **Use React Native Debugger** to inspect responsive values

## Troubleshooting

### Issue: "useResponsive must be used within a ResponsiveWrapper"
**Solution:** Make sure your component is wrapped with `ResponsiveWrapper`

### Issue: Text not updating on orientation change
**Solution:** Use `useDynamicSizing={true}` on ResponsiveText components

### Issue: Layout not adapting to screen size
**Solution:** Use the `dimensions` object to conditionally apply styles

## Next Steps

1. **Start with one screen** - Convert your most important screen first
2. **Test thoroughly** - Make sure it works on different devices
3. **Gradually migrate** - Convert other screens one by one
4. **Customize as needed** - Adjust the responsive utilities for your specific needs

The system is designed to work alongside your existing code, so you can migrate gradually without breaking anything!
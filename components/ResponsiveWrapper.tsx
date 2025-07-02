import React, { createContext, useContext, ReactNode } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveDimensions } from '../hooks/useResponsiveDimensions';
import { createResponsiveUtils } from '../utils/dynamicResponsive';

// Create context for responsive utilities
interface ResponsiveContextType {
  dimensions: ReturnType<typeof useResponsiveDimensions>;
  responsive: ReturnType<typeof createResponsiveUtils>;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

// Hook to use responsive context
export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within a ResponsiveWrapper');
  }
  return context;
};

interface ResponsiveWrapperProps extends ViewProps {
  children: ReactNode;
  useSafeArea?: boolean;
  backgroundColor?: string;
  horizontalPadding?: boolean;
  verticalPadding?: boolean;
  customPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  useSafeArea = true,
  backgroundColor = '#FFFFFF',
  horizontalPadding = true,
  verticalPadding = false,
  customPadding,
  style,
  ...props
}) => {
  const dimensions = useResponsiveDimensions();
  const responsive = createResponsiveUtils(dimensions.width, dimensions.height);

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      paddingHorizontal: horizontalPadding ? responsive.getHorizontalPadding() : 0,
      paddingVertical: verticalPadding ? responsive.getVerticalPadding() : 0,
      paddingTop: customPadding?.top,
      paddingBottom: customPadding?.bottom,
      paddingLeft: customPadding?.left,
      paddingRight: customPadding?.right,
    },
    style,
  ];

  const contextValue = {
    dimensions,
    responsive,
  };

  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <ResponsiveContext.Provider value={contextValue}>
      <Container style={containerStyle} {...props}>
        {children}
      </Container>
    </ResponsiveContext.Provider>
  );
};

// Additional responsive components for common use cases
interface ResponsiveViewProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  padding?: number;
  margin?: number;
  children: ReactNode;
}

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  width,
  height,
  padding,
  margin,
  children,
  style,
  ...props
}) => {
  const { responsive } = useResponsive();

  const viewStyle = [
    {
      width: typeof width === 'number' ? responsive.wp(width) : width,
      height: typeof height === 'number' ? responsive.hp(height) : height,
      padding: padding ? responsive.spacing.medium : undefined,
      margin: margin ? responsive.spacing.small : undefined,
    },
    style,
  ];

  return (
    <View style={viewStyle} {...props}>
      {children}
    </View>
  );
};

// Responsive container for cards/components
interface ResponsiveCardProps extends ViewProps {
  columns?: number;
  spacing?: number;
  children: ReactNode;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  columns = 1,
  spacing = 16,
  children,
  style,
  ...props
}) => {
  const { responsive } = useResponsive();

  const cardStyle = [
    styles.card,
    {
      width: responsive.getCardWidth(columns, spacing),
      padding: responsive.spacing.medium,
    },
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

// Responsive button container
interface ResponsiveButtonProps extends ViewProps {
  fullWidth?: boolean;
  children: ReactNode;
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  fullWidth = false,
  children,
  style,
  ...props
}) => {
  const { responsive } = useResponsive();

  const buttonStyle = [
    styles.button,
    {
      width: fullWidth ? responsive.getContainerWidth(100) : 'auto',
      height: responsive.getButtonHeight(),
      paddingHorizontal: responsive.spacing.large,
    },
    style,
  ];

  return (
    <View style={buttonStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default ResponsiveWrapper;
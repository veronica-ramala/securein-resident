import React, { memo, useCallback } from 'react';
import { Tabs } from 'expo-router';
import { Home, User, ShoppingBag, Calendar } from 'lucide-react-native';
import ServiceIcon from '../../components/ServiceIcon';
import { useLocalization } from '../../context/LocalizationContext';
import { s, vs, fontSize, getResponsiveText, getTabLabel } from '../../utils/responsive';

// Memoize tab icons for better performance
const HomeIcon = memo(({ color }: { color: string }) => <Home size={22} color={color} />);
const ServiceIconMemo = memo(({ color }: { color: string }) => <ServiceIcon size={22} color={color} />);
const CalendarIcon = memo(({ color }: { color: string }) => <Calendar size={22} color={color} />);
const ShoppingIcon = memo(({ color }: { color: string }) => <ShoppingBag size={22} color={color} />);
const UserIcon = memo(({ color }: { color: string }) => <User size={22} color={color} />);

function TabLayout() {
  const { t } = useLocalization();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#4DD0E1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DDDBCB',
          borderTopWidth: 1,
          height: vs(85), // Increased height for better text visibility
          paddingBottom: vs(8),
          paddingTop: vs(8),
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: vs(4),
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: fontSize.tiny,
          fontWeight: '600',
          marginTop: vs(2),
          textAlign: 'center',
          lineHeight: fontSize.tiny * 1.3,
          flexWrap: 'wrap',
          maxWidth: s(80), // Limit width to prevent overflow
        },
        tabBarLabelPosition: 'below-icon',
        tabBarAllowFontScaling: true,
        lazy: true, // Enable lazy loading
        freezeOnBlur: true, // Freeze inactive screens for better performance
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          title: getTabLabel(t('navigation.home')),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ color }) => <ServiceIconMemo color={color} />,
          title: getTabLabel(t('navigation.services')),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
          title: getTabLabel(t('events.title')),
        }}
      />
      <Tabs.Screen
        name="buy-sell"
        options={{
          tabBarIcon: ({ color }) => <ShoppingIcon color={color} />,
          title: getTabLabel(t('buySell.title')),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          title: getTabLabel(t('navigation.profile')),
        }}
      />
      
      {/* The screens below are still accessible via navigation but hidden from tab bar */}
      <Tabs.Screen
        name="add-visitor"
        options={{ href: null }} // This removes it from the tab bar completely
      />
      <Tabs.Screen
        name="my-visitors"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="emergency"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="requests"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="gate"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="store"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="facilities"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="community-map"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="community-services"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="local-connect"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="change-password"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="security"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="elder-monitoring"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="visitor-registration"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="visitor-qr"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="delivery-registration"
        options={{ href: null }}
      />
    </Tabs>
  );
}

export default memo(TabLayout);
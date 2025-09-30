import React, { memo } from 'react';
import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import { useLocalization } from "../../../context/LocalizationContext";
import { vs, fontSize, s, getTabLabel } from '../../../utils/responsive';

const HomeIcon = memo(({ color }: { color: string }) => <Home size={22} color={color} />);
const UserIcon = memo(({ color }: { color: string }) => <User size={22} color={color} />);

function TabLayout() {
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        // keep the nav header OFF by default to avoid double headers
        headerShown: false,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#4DD0E1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DDDBCB',
          borderTopWidth: 1,
          height: vs(85),
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
          maxWidth: s(80),
        },
        tabBarLabelPosition: 'below-icon',
        tabBarAllowFontScaling: true,
        lazy: true,
        freezeOnBlur: true,
      }}
    >
      {/* Home – keep nav header OFF; use your own header inside screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: getTabLabel(t('navigation.home')),
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerShown: false,
        }}
      />

      {/* Profile – same: nav header OFF */}
      <Tabs.Screen
        name="profile"
        options={{
          title: getTabLabel(t('navigation.profile')),
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          headerShown: false,
        }}
      />

      {/* hidden/internal routes */}
      <Tabs.Screen name="add-visitor" options={{ href: null }} />
      <Tabs.Screen name="my-visitors" options={{ href: null }} />
      <Tabs.Screen name="emergency" options={{ href: null }} />
      <Tabs.Screen name="requests" options={{ href: null }} />
      <Tabs.Screen name="gate" options={{ href: null }} />
      <Tabs.Screen name="store" options={{ href: null }} />
      <Tabs.Screen name="facilities" options={{ href: null }} />
      <Tabs.Screen name="community-map" options={{ href: null }} />
      <Tabs.Screen name="community-services" options={{ href: null }} />
      <Tabs.Screen name="local-connect" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="change-password" options={{ href: null }} />
      <Tabs.Screen name="security" options={{ href: null }} />
      <Tabs.Screen name="elder-monitoring" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="weather-card" options={{ href: null }} />
      <Tabs.Screen name="visitor-registration" options={{ href: null }} />
      <Tabs.Screen name="visitor-qr" options={{ href: null }} />
      <Tabs.Screen name="delivery-registration" options={{ href: null }} />
      <Tabs.Screen name="cab-registration" options={{ href: null }} />
      <Tabs.Screen name="buy-sell" options={{ href: null }} />
    </Tabs>
  );
}

export default memo(TabLayout);

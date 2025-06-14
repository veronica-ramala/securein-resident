import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';
import ServiceIcon from '../../components/ServiceIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0077B6',
        tabBarInactiveTintColor: '#90CAF9',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DDDBCB',
          borderTopWidth: 1,
          height: 75,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} />
          ),
          title: 'Home', // This is for header/navigation, not shown in tab bar
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ color }) => (
            <ServiceIcon size={24} color={color} />
          ),
          title: 'Services',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
          title: 'Profile',
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
    </Tabs>
  );
}
// app/(drawer)/_layout.tsx
import React from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; // ✅ correct source
import { TouchableOpacity, Text,View ,StyleSheet } from 'react-native';
import { Home, Calendar, Wrench, ShoppingBag, LogOut } from 'lucide-react-native';
import { useUserContext } from '../../context/UserContext';
import { useLocalization } from '../../context/LocalizationContext';

export default function DrawerGroupLayout() {
  const { isLoggedIn, logout } = useUserContext();
  const { t } = useLocalization();
  const rootState = useRootNavigationState();
  const rootReady = !!rootState?.key;
  if (!rootReady) return null; // (optional) splash/loader

  // Auth guard
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerActiveTintColor: '#1E88E5',
        drawerInactiveTintColor: '#6B7280',
        drawerActiveBackgroundColor: 'rgba(30, 136, 229, 0.1)',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerItemStyle: {
          marginVertical: 4,
          marginHorizontal: 12,
          borderRadius: 8,
          paddingVertical: 4,
        },
        drawerLabelStyle: {
          paddingLeft: 12,
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -16,
        },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <DrawerItemList {...props} />

            {/* Logout pinned at bottom */}
           
<TouchableOpacity style={styles.logoutButton} onPress={logout}>
  <LogOut size={20} color="#fff" style={{ marginRight: 8 }} />
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      )}
    >
      {/* Make the whole tabs group a drawer screen */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: t('navigation.home'),
          drawerIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* Events Screen */}
      <Drawer.Screen
        name="events"
        options={{
          drawerLabel: 'Events',
          drawerIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />

      {/* Services Screen */}
      <Drawer.Screen
        name="services"
        options={{
          drawerLabel: t('navigation.services') || 'Services',
          drawerIcon: ({ color, size }) => <Wrench size={size} color={color} />,
        }}
      />

      {/* Buy & Sell Screen */}
      <Drawer.Screen
        name="buy-sell"
        options={{
          drawerLabel: t('navigation.buySell') || 'Buy & Sell',
          drawerIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />

      {/* Hide index from drawer */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: '#ed1527ff', // 🔴 red button
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

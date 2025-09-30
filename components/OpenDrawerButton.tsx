// components/OpenDrawerButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';

export default function OpenDrawerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      accessibilityRole="button"
      accessibilityLabel="Open side menu"
    >
      <Menu size={22} color="#111827" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

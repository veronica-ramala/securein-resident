// components/WeatherQuickAccess.tsx
// Quick access component to add to any screen for testing the weather card

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const WeatherQuickAccess: React.FC = () => {
  const router = useRouter();

  const goToWeatherTest = () => {
    router.push('/weather-test' as any);
  };

  return (
    <TouchableOpacity 
      style={styles.quickAccessButton}
      onPress={goToWeatherTest}
    >
      <Text style={styles.buttonText}>🌤️ Test Weather Animations</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quickAccessButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default WeatherQuickAccess;
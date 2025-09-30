// Path: components/QuickWeatherDemo.tsx
// Quick demo component you can add to any screen to test both demo and location weather

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeatherCard from './WeatherCard';
import WeatherCardWithLocation from './WeatherCardWithLocation';

const QuickWeatherDemo: React.FC = () => {
  const [showLocationWeather, setShowLocationWeather] = useState(false);

  const handleLocationToggle = () => {
    if (!showLocationWeather) {
      Alert.alert(
        'Test Location Weather',
        'This will request your location to show real weather data. Allow location access when prompted.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Test Location', onPress: () => setShowLocationWeather(true) }
        ]
      );
    } else {
      setShowLocationWeather(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Card Demo</Text>
      
      {/* Toggle buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, !showLocationWeather && styles.activeToggle]}
          onPress={() => setShowLocationWeather(false)}
        >
          <Text style={[styles.toggleText, !showLocationWeather && styles.activeToggleText]}>
            🎬 Demo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleButton, showLocationWeather && styles.activeToggle]}
          onPress={handleLocationToggle}
        >
          <Ionicons 
            name="location" 
            size={14} 
            color={showLocationWeather ? "#FFFFFF" : "#64748B"}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.toggleText, showLocationWeather && styles.activeToggleText]}>
            Location
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weather card */}
      {showLocationWeather ? (
        <WeatherCardWithLocation showControls={false} />
      ) : (
        <WeatherCard
          temperature={25}
          condition="sunny"
          location="Demo Location"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  activeToggle: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
});

export default QuickWeatherDemo;

// HOW TO TEST:
// 1. Add this import to any of your existing screens:
//    import QuickWeatherDemo from '../components/QuickWeatherDemo';
//
// 2. Add <QuickWeatherDemo /> to your JSX
//
// 3. Toggle between Demo and Location modes to test both features!

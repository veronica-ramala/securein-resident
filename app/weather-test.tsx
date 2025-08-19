// app/weather-test.tsx
// Enhanced test screen for the WeatherCard component with auto-cycling animations

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherCard from '../components/WeatherCard';
import WeatherCardWithLocation from '../components/WeatherCardWithLocation';
import LocationDebugInfo from '../components/LocationDebugInfo';
import { WeatherCondition } from '../types/weather';
import { Ionicons } from '@expo/vector-icons';

const weatherConditions = [
  { condition: 'sunny' as WeatherCondition, temperature: 32, location: '☀️ Sunny Paradise' },
  { condition: 'rainy' as WeatherCondition, temperature: 18, location: '🌧️ Rainy Seattle' },
  { condition: 'cloudy' as WeatherCondition, temperature: 22, location: '☁️ Cloudy London' },
  { condition: 'snowy' as WeatherCondition, temperature: -5, location: '❄️ Snowy Alps' },
  { condition: 'thunderstorm' as WeatherCondition, temperature: 16, location: '⛈️ Storm Valley' },
];

export default function WeatherTestScreen() {
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [autoMode, setAutoMode] = useState(true);
  const [showLocationWeather, setShowLocationWeather] = useState(false);

  // Auto-cycle through weather conditions
  useEffect(() => {
    if (autoMode && !showLocationWeather) {
      const interval = setInterval(() => {
        setCurrentWeatherIndex((prev) => (prev + 1) % weatherConditions.length);
      }, 6000); // Change every 6 seconds

      return () => clearInterval(interval);
    }
  }, [autoMode, showLocationWeather]);

  const currentWeather = weatherConditions[currentWeatherIndex];

  const handleLocationToggle = () => {
    if (!showLocationWeather) {
      Alert.alert(
        'Enable Location Weather',
        'This will request your location to show real weather data for your area. Make sure to allow location access.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setShowLocationWeather(true) }
        ]
      );
    } else {
      setShowLocationWeather(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🌤️ Enhanced Weather Card Demo</Text>
        <Text style={styles.subtitle}>
          {showLocationWeather 
            ? 'Showing weather for your current location!' 
            : 'Watch the spectacular animations and visual effects!'
          }
        </Text>
        
        {/* Mode toggles */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, !showLocationWeather && styles.activeModeButton]}
            onPress={() => setShowLocationWeather(false)}
          >
            <Text style={[styles.modeButtonText, !showLocationWeather && styles.activeModeButtonText]}>
              🎬 Demo Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeButton, showLocationWeather && styles.activeModeButton]}
            onPress={handleLocationToggle}
          >
            <Ionicons 
              name="location" 
              size={16} 
              color={showLocationWeather ? "#FFFFFF" : "#475569"} 
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.modeButtonText, showLocationWeather && styles.activeModeButtonText]}>
              My Location
            </Text>
          </TouchableOpacity>
        </View>

        {showLocationWeather ? (
          <>
            {/* Location-based weather card */}
            <View style={styles.locationWeatherSection}>
              <Text style={styles.sectionTitle}>📍 Weather at Your Location</Text>
              <WeatherCardWithLocation showControls={true} />
              
              {/* Debug information */}
              <View style={styles.debugSection}>
                <Text style={styles.debugTitle}>🔍 Location Debug Info</Text>
                <Text style={styles.debugSubtitle}>
                  This shows exactly what location data was detected:
                </Text>
                <LocationDebugInfo />
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Auto mode toggle for demo */}
            <TouchableOpacity 
              style={[styles.autoModeButton, autoMode && styles.activeAutoModeButton]}
              onPress={() => setAutoMode(!autoMode)}
            >
              <Text style={[styles.autoModeButtonText, autoMode && styles.activeAutoModeButtonText]}>
                {autoMode ? '⏸️ Auto Cycle ON' : '▶️ Auto Cycle OFF'}
              </Text>
            </TouchableOpacity>

            {/* Current weather display */}
            <Text style={styles.currentCondition}>
              Currently showing: {currentWeather.condition.toUpperCase()}
            </Text>

            {/* Main animated weather card */}
            <WeatherCard
              temperature={currentWeather.temperature}
              condition={currentWeather.condition}
              location={currentWeather.location}
            />
          </>
        )}

        {/* Manual selection buttons - only in demo mode */}
        {!showLocationWeather && (
          <View style={styles.buttonGrid}>
            {weatherConditions.map((weather, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.weatherButton,
                  currentWeatherIndex === index && styles.activeWeatherButton
                ]}
                onPress={() => {
                  setAutoMode(false);
                  setCurrentWeatherIndex(index);
                }}
              >
                <Text style={styles.weatherButtonText}>
                  {weather.condition}
                </Text>
                <Text style={styles.weatherButtonTemp}>
                  {weather.temperature}°
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Animation features list */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>🎬 Animation Features:</Text>
          
          <Text style={styles.featureItem}>☀️ Sunny: Rotating sun with pulsing rays + glowing effect</Text>
          <Text style={styles.featureItem}>🌧️ Rainy: Animated falling raindrops with realistic motion</Text>
          <Text style={styles.featureItem}>☁️ Cloudy: Floating clouds with drift animation</Text>
          <Text style={styles.featureItem}>❄️ Snowy: Swirling snowflakes with scale animation</Text>
          <Text style={styles.featureItem}>⛈️ Thunderstorm: Lightning flashes + moving clouds</Text>
          <Text style={styles.featureItem}>🎮 Global: Card bounce, temperature pulse, gradient waves</Text>
        </View>

        {/* All weather cards at once */}
        <Text style={styles.sectionTitle}>All Weather Conditions:</Text>
        {weatherConditions.map((weather, index) => (
          <WeatherCard
            key={index}
            temperature={weather.temperature}
            condition={weather.condition}
            location={weather.location}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  modeButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 140,
  },
  activeModeButton: {
    backgroundColor: '#3B82F6',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  autoModeButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  activeAutoModeButton: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  autoModeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeAutoModeButtonText: {
    color: '#FFFFFF',
  },
  locationWeatherSection: {
    marginVertical: 10,
  },
  debugSection: {
    marginTop: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  debugSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  currentCondition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  weatherButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeWeatherButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  weatherButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  weatherButtonTemp: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 20,
    paddingLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
});
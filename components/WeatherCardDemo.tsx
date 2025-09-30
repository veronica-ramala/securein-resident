// Path: components/WeatherCardDemo.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import WeatherCard from './WeatherCard';

const WeatherCardDemo: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<{
    temperature: number;
    condition: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'thunderstorm';
  }>({
    temperature: 24,
    condition: 'sunny',
  });

  // Demo weather conditions
  const weatherOptions = [
    { condition: 'sunny' as const, temperature: 28, location: 'Downtown' },
    { condition: 'rainy' as const, temperature: 18, location: 'City Center' },
    { condition: 'cloudy' as const, temperature: 22, location: 'Suburbs' },
    { condition: 'snowy' as const, temperature: -2, location: 'Mountain View' },
    { condition: 'thunderstorm' as const, temperature: 16, location: 'Riverside' },
  ];

  // Auto-cycle through weather conditions for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather((prev) => {
        const currentIndex = weatherOptions.findIndex(
          (option) => option.condition === prev.condition
        );
        const nextIndex = (currentIndex + 1) % weatherOptions.length;
        return weatherOptions[nextIndex];
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Weather Card Demo</Text>
        <Text style={styles.subtitle}>
          Modern animated weather cards with dynamic gradients
        </Text>

        {/* Main Weather Card */}
        <WeatherCard
          temperature={currentWeather.temperature}
          condition={currentWeather.condition}
          location="Current Location"
        />

        {/* Manual Weather Selection */}
        <Text style={styles.sectionTitle}>Try Different Weather Conditions:</Text>
        <View style={styles.buttonGrid}>
          {weatherOptions.map((weather, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.weatherButton,
                currentWeather.condition === weather.condition && styles.activeButton
              ]}
              onPress={() => setCurrentWeather(weather)}
            >
              <Text style={[
                styles.buttonText,
                currentWeather.condition === weather.condition && styles.activeButtonText
              ]}>
                {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
              </Text>
              <Text style={[
                styles.buttonTemp,
                currentWeather.condition === weather.condition && styles.activeButtonText
              ]}>
                {weather.temperature}°
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Multiple Cards Example */}
        <Text style={styles.sectionTitle}>Multiple Weather Cards:</Text>
        {weatherOptions.slice(0, 3).map((weather, index) => (
          <WeatherCard
            key={index}
            temperature={weather.temperature}
            condition={weather.condition}
            location={weather.location}
          />
        ))}

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features:</Text>
          <Text style={styles.featureItem}>✨ Dynamic gradient backgrounds</Text>
          <Text style={styles.featureItem}>🎮 Smooth bounce animations</Text>
          <Text style={styles.featureItem}>🌟 Weather-specific icons</Text>
          <Text style={styles.featureItem}>💫 Gentle pulse effects</Text>
          <Text style={styles.featureItem}>🎨 Modern typography</Text>
          <Text style={styles.featureItem}>📱 Responsive design</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginTop: 30,
    marginBottom: 15,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weatherButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
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
  activeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 2,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  buttonTemp: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default WeatherCardDemo;

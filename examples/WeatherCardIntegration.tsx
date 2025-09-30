// Path: examples/WeatherCardIntegration.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherCard from '../components/WeatherCard';
import { WeatherCondition } from '../types/weather';
import * as Location from 'expo-location';

// Example integration of WeatherCard into your existing screens
const WeatherCardIntegration: React.FC = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    condition: 'sunny' as WeatherCondition,
    location: 'Loading...',
  });

  const [loading, setLoading] = useState(true);

  // Simulate fetching real weather data
  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed to show weather data.');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // In a real app, you would call a weather API like OpenWeatherMap
      // For demo purposes, we'll simulate different weather conditions
      const mockWeatherConditions: WeatherCondition[] = ['sunny', 'rainy', 'cloudy', 'snowy', 'thunderstorm'];
      const randomCondition = mockWeatherConditions[Math.floor(Math.random() * mockWeatherConditions.length)];
      
      // Get city name from coordinates (reverse geocoding)
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const cityName = address[0]?.city || 'Your Location';

      // Simulate weather data based on condition
      const temperatureMap = {
        sunny: Math.floor(Math.random() * 10) + 25, // 25-35°C
        rainy: Math.floor(Math.random() * 8) + 15,  // 15-23°C
        cloudy: Math.floor(Math.random() * 7) + 18, // 18-25°C
        snowy: Math.floor(Math.random() * 10) - 5,  // -5°C to 5°C
        thunderstorm: Math.floor(Math.random() * 5) + 16, // 16-21°C
      };

      setWeatherData({
        temperature: temperatureMap[randomCondition],
        condition: randomCondition,
        location: cityName,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback to default data
      setWeatherData({
        temperature: 22,
        condition: 'cloudy',
        location: 'Default Location',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.title}>Today's Weather</Text>
        <Text style={styles.subtitle}>Real-time weather updates for your location</Text>

        {/* Weather Card - This is how you integrate it */}
        <WeatherCard
          temperature={weatherData.temperature}
          condition={weatherData.condition}
          location={weatherData.location}
        />

        {/* Additional Content */}
        <View style={styles.additionalContent}>
          <Text style={styles.sectionTitle}>Weather Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Condition:</Text>
            <Text style={styles.detailValue}>
              {weatherData.condition.charAt(0).toUpperCase() + weatherData.condition.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Temperature:</Text>
            <Text style={styles.detailValue}>{weatherData.temperature}°C</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{weatherData.location}</Text>
          </View>
        </View>

        {/* Integration Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Integrate:</Text>
          <Text style={styles.instructionText}>
            1. Import WeatherCard component{'\n'}
            2. Add weather data state{'\n'}
            3. Fetch weather from API{'\n'}
            4. Render the WeatherCard with your data
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Example of how to add WeatherCard to your existing home screen
export const addWeatherToHomeScreen = `
// In your existing home screen (e.g., app/(tabs)/index.tsx)

// 1. Add the import
import WeatherCard from '../../components/WeatherCard';

// 2. Add state for weather data
const [weatherData, setWeatherData] = useState({
  temperature: 24,
  condition: 'sunny' as WeatherCondition,
  location: 'Your City',
});

// 3. Add the WeatherCard component to your JSX
<WeatherCard
  temperature={weatherData.temperature}
  condition={weatherData.condition}
  location={weatherData.location}
/>
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
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
  additionalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#F1F5F9',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});

export default WeatherCardIntegration;

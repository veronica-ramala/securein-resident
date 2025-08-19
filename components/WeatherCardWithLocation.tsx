// components/WeatherCardWithLocation.tsx
// Weather card that automatically fetches and displays user's current location

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WeatherCard from './WeatherCard';
import { useWeatherLocation } from '../hooks/useWeatherLocation';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherCardWithLocationProps {
  showControls?: boolean;
  autoFetch?: boolean;
}

const WeatherCardWithLocation: React.FC<WeatherCardWithLocationProps> = ({
  showControls = true,
  autoFetch = true,
}) => {
  const { weatherData, loading, error, refreshWeather, locationData } = useWeatherLocation(autoFetch);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWeather();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLocationError = () => {
    Alert.alert(
      'Location Error',
      error || 'Unable to get your location. Please check your location settings and try again.',
      [
        { text: 'Try Again', onPress: handleRefresh },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  if (loading && !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#0369A1" />
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.loadingSubtext}>Please allow location access</Text>
        </LinearGradient>
      </View>
    );
  }

  if (error && !weatherData) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={['#FEF2F2', '#FED7D7', '#FCA5A5']}
          style={styles.errorGradient}
        >
          <Ionicons name="location-outline" size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Location Error</Text>
          <Text style={styles.errorText}>
            {error.includes('permission') 
              ? 'Location permission is required to show weather for your area'
              : 'Unable to get your current location'
            }
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={handleLocationError}>
            <Text style={styles.settingsButtonText}>Settings Help</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No weather data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Load Weather</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Weather Card with Location */}
      <WeatherCard
        temperature={weatherData.temperature}
        condition={weatherData.condition}
        location={weatherData.location}
      />

      {/* Location Details */}
      {locationData && (
        <View style={styles.locationDetails}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.locationText}>
              {weatherData.location}
            </Text>
          </View>
          
          {/* Show more detailed location info if available */}
          {locationData && ((locationData as any).district || (locationData as any).name || locationData.city !== weatherData.location) && (
            <View style={styles.detailedLocationRow}>
              <Text style={styles.detailedLocationText}>
                📍 {[
                  (locationData as any).name && (locationData as any).name !== weatherData.location ? (locationData as any).name : null,
                  (locationData as any).district && (locationData as any).district !== weatherData.location ? (locationData as any).district : null,
                  locationData.city && locationData.city !== weatherData.location ? locationData.city : null,
                  locationData.region
                ].filter(Boolean).join(' • ')}
              </Text>
            </View>
          )}
          
          {weatherData.description && (
            <Text style={styles.descriptionText}>{weatherData.description}</Text>
          )}
          
          <View style={styles.detailsRow}>
            {weatherData.humidity && (
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{weatherData.humidity}%</Text>
              </View>
            )}
            {weatherData.windSpeed && (
              <View style={styles.detailItem}>
                <Ionicons name="flag-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>{weatherData.windSpeed} km/h</Text>
              </View>
            )}
            {locationData && (
              <View style={styles.detailItem}>
                <Ionicons name="navigate-outline" size={14} color="#6B7280" />
                <Text style={styles.detailText}>
                  {locationData.latitude.toFixed(2)}, {locationData.longitude.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.refreshButton, isRefreshing && styles.refreshingButton]} 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={isRefreshing ? "#9CA3AF" : "#FFFFFF"} 
            />
            <Text style={[styles.refreshButtonText, isRefreshing && styles.refreshingText]}>
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 280,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#0284C7',
    marginTop: 4,
    textAlign: 'center',
  },
  errorContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  errorGradient: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 280,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  settingsButtonText: {
    color: '#DC2626',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  locationDetails: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: -10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  detailedLocationRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  detailedLocationText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  controls: {
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  refreshingButton: {
    backgroundColor: '#E5E7EB',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  refreshingText: {
    color: '#9CA3AF',
  },
});

export default WeatherCardWithLocation;
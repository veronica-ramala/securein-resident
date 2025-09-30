// Path: components/LocationDebugInfo.tsx
// Debug component to show detailed location information

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocation, LocationData } from '../hooks/useLocation';

const LocationDebugInfo: React.FC = () => {
  const { location, loading, error } = useLocation();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Location Debug Info</Text>
        <Text style={styles.loadingText}>Loading location data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Location Debug Info</Text>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Location Debug Info</Text>
        <Text style={styles.noDataText}>No location data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Location Debug Info</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Coordinates</Text>
        <Text style={styles.dataText}>Latitude: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.dataText}>Longitude: {location.longitude.toFixed(6)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏠 Address Components</Text>
        <Text style={styles.dataText}>Name: {(location as any).name || 'Not available'}</Text>
        <Text style={styles.dataText}>Street: {location.address || 'Not available'}</Text>
        <Text style={styles.dataText}>District: {(location as any).district || 'Not available'}</Text>
        <Text style={styles.dataText}>Subregion: {(location as any).subregion || 'Not available'}</Text>
        <Text style={styles.dataText}>City: {location.city || 'Not available'}</Text>
        <Text style={styles.dataText}>Region: {location.region || 'Not available'}</Text>
        <Text style={styles.dataText}>Country: {location.country || 'Not available'}</Text>
        <Text style={styles.dataText}>Postal Code: {(location as any).postalCode || 'Not available'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Formatted Result</Text>
        <Text style={styles.formattedText}>{location.formattedAddress}</Text>
      </View>

      {(location as any).rawAddress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Raw Geocoding Data</Text>
          <Text style={styles.rawText}>{JSON.stringify((location as any).rawAddress, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    maxHeight: 400,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  formattedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    padding: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
  },
  rawText: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: 'monospace',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LocationDebugInfo;

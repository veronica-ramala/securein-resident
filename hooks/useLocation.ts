// hooks/useLocation.ts
// Hook to get user's current location with proper error handling

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  formattedAddress?: string;
  // Additional detailed location info
  district?: string;
  subregion?: string;
  name?: string;
  postalCode?: string;
  // Debug info
  rawAddress?: any;
}

export interface UseLocationResult {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasPermission: boolean;
  getBestLocationName: () => string;
}

// Helper function to get the best display name for the location (moved outside hook for export)
export const getBestLocationName = (locationData: LocationData): string => {
  // Priority order for the main location name
  if ((locationData as any).name && !(locationData as any).name.includes('Unnamed') && (locationData as any).name.length > 2) {
    return (locationData as any).name;
  }
  
  if ((locationData as any).district && (locationData as any).district !== locationData.city) {
    return (locationData as any).district;
  }
  
  if ((locationData as any).subregion && (locationData as any).subregion !== locationData.city) {
    return (locationData as any).subregion;
  }
  
  return locationData.city || locationData.formattedAddress || 'Current Location';
};

export const useLocation = (autoFetch: boolean = true): UseLocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        setError('Location permission denied. Please enable location access in your device settings.');
      }
      
      return granted;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      // Check if location services are enabled
      const locationServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!locationServicesEnabled) {
        throw new Error('Location services are disabled. Please enable location services in your device settings.');
      }

      // Get current position with highest accuracy possible
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000, // Give more time for accurate reading
        distanceInterval: 1,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address - try multiple attempts for better accuracy
      try {
        console.log('Attempting reverse geocoding for coordinates:', { latitude, longitude });
        
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        console.log('Geocoding returned', reverseGeocode.length, 'results');
        
        if (reverseGeocode.length > 0) {
          // Check if we got multiple results and pick the most specific one
          let bestAddress = reverseGeocode[0];
          
          // Prefer results with more specific 'name' field
          for (const address of reverseGeocode) {
            if (address.name && address.name.length > 0 && !address.name.includes('Unnamed')) {
              console.log('Found address with specific name:', address.name);
              bestAddress = address;
              break;
            }
          }
          
          // Log the raw address data for debugging
          console.log('Using geocoding data:', bestAddress);
          console.log('All geocoding results:', reverseGeocode);
          
          const locationData: LocationData = {
            latitude,
            longitude,
            address: bestAddress.street || undefined,
            city: bestAddress.city || undefined,
            region: bestAddress.region || undefined,
            country: bestAddress.country || undefined,
            district: bestAddress.district || undefined,
            subregion: bestAddress.subregion || undefined,
            name: bestAddress.name || undefined,
            postalCode: bestAddress.postalCode || undefined,
            rawAddress: bestAddress,
            formattedAddress: formatAddress(bestAddress),
          };
          
          return locationData;
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      // Return basic location data if geocoding fails
      return {
        latitude,
        longitude,
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };

    } catch (err: any) {
      console.error('Location error:', err);
      throw new Error(err.message || 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: Location.LocationGeocodedAddress): string => {
    const parts = [];
    
    // Prioritize more specific location names
    // 1. Try 'name' first (often contains specific locality like "Hitech City")
    if (address.name && !address.name.includes('Unnamed') && address.name !== address.city) {
      parts.push(address.name);
    }
    
    // 2. Add district/subregion if different from city
    if (address.district && address.district !== address.city && address.district !== address.name) {
      parts.push(address.district);
    } else if (address.subregion && address.subregion !== address.city && address.subregion !== address.name) {
      parts.push(address.subregion);
    }
    
    // 3. Add city if we don't have more specific info, or if it's different
    if (address.city) {
      if (parts.length === 0 || !parts.some(part => part.toLowerCase().includes(address.city!.toLowerCase()))) {
        parts.push(address.city);
      }
    }
    
    // 4. Add region/state
    if (address.region && !parts.includes(address.region)) {
      parts.push(address.region);
    }
    
    // 5. Add country if different from region
    if (address.country && address.country !== address.region && !parts.includes(address.country)) {
      parts.push(address.country);
    }

    const result = parts.join(', ') || 'Unknown Location';
    console.log('Formatted address:', result, 'from parts:', parts);
    return result;
  };



  const requestLocation = async (): Promise<void> => {
    try {
      const hasPermissionResult = hasPermission || await requestPermission();
      
      if (!hasPermissionResult) {
        return;
      }

      const locationData = await getCurrentLocation();
      setLocation(locationData);
    } catch (err: any) {
      setError(err.message);
      setLocation(null);
    }
  };

  // Auto-fetch location on mount if requested
  useEffect(() => {
    if (autoFetch) {
      requestLocation();
    }
  }, [autoFetch]);

  return {
    location,
    loading,
    error,
    requestLocation,
    hasPermission,
    getBestLocationName: location ? () => getBestLocationName(location) : () => 'Unknown Location',
  };
};

export default useLocation;
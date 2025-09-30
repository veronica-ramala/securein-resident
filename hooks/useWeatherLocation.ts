// hooks/useWeatherLocation.ts
// Hook that combines location and weather data for the weather card

import { useState, useEffect } from 'react';
import { useLocation, LocationData, getBestLocationName } from './useLocation';
import { WeatherCondition } from '../types/weather';

export interface WeatherLocationData {
  temperature: number;
  condition: WeatherCondition;
  location: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

export interface UseWeatherLocationResult {
  weatherData: WeatherLocationData | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  locationData: LocationData | null;
}

// Demo weather data generator based on location
const generateDemoWeatherData = (locationData: LocationData): WeatherLocationData => {
  // Simple demo logic - you can replace this with actual API calls
  const conditions: WeatherCondition[] = ['sunny', 'rainy', 'cloudy', 'snowy', 'thunderstorm'];
  
  // Use location to seed random weather (for demo purposes)
  const locationSeed = Math.abs(Math.floor(locationData.latitude + locationData.longitude));
  const conditionIndex = locationSeed % conditions.length;
  const condition = conditions[conditionIndex];
  
  // Generate temperature based on latitude (simple approximation)
  const baseTemp = 25 - Math.abs(locationData.latitude) * 0.5;
  const randomVariation = (Math.random() - 0.5) * 20;
  const temperature = Math.round(baseTemp + randomVariation);
  
  const weatherDescriptions = {
    sunny: 'Clear skies with plenty of sunshine',
    rainy: 'Light rain with overcast skies',
    cloudy: 'Mostly cloudy with some clear patches',
    snowy: 'Light snow falling with cold temperatures',
    thunderstorm: 'Thunderstorms with heavy rain'
  };

  // Get the best location name for display
  const bestLocationName = getBestLocationName(locationData);
  
  return {
    temperature,
    condition,
    location: bestLocationName,
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    description: weatherDescriptions[condition],
    coords: {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    },
  };
};

export const useWeatherLocation = (autoFetch: boolean = true): UseWeatherLocationResult => {
  const { location: locationData, loading: locationLoading, error: locationError, requestLocation } = useLocation(autoFetch);
  const [weatherData, setWeatherData] = useState<WeatherLocationData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const fetchWeatherData = async (location: LocationData): Promise<WeatherLocationData> => {
    // In a real app, you would call a weather API here
    // For now, we'll generate demo data
    
    try {
      setWeatherLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace this with actual weather API call
      // Example:
      // const response = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=YOUR_API_KEY&units=metric`
      // );
      // const data = await response.json();
      // return parseWeatherData(data, location);
      
      return generateDemoWeatherData(location);
      
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  const refreshWeather = async (): Promise<void> => {
    try {
      setWeatherError(null);
      
      if (!locationData) {
        await requestLocation();
        return;
      }
      
      const weather = await fetchWeatherData(locationData);
      setWeatherData(weather);
    } catch (error: any) {
      setWeatherError(error.message);
      setWeatherData(null);
    }
  };

  // Fetch weather data when location is available
  useEffect(() => {
    if (locationData && !weatherData) {
      fetchWeatherData(locationData)
        .then(setWeatherData)
        .catch((error) => setWeatherError(error.message));
    }
  }, [locationData]);

  const loading = locationLoading || weatherLoading;
  const error = locationError || weatherError;

  return {
    weatherData,
    loading,
    error,
    refreshWeather,
    locationData,
  };
};

export default useWeatherLocation;
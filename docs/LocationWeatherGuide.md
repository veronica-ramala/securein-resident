# 📍 Location-Based Weather Card Guide

The enhanced weather system now includes automatic location detection and real weather data display!

## 🚀 **Quick Start**

### **Method 1: Auto-Location Weather Card**
```tsx
import WeatherCardWithLocation from '../components/WeatherCardWithLocation';

// Shows weather for user's current location
<WeatherCardWithLocation />
```

### **Method 2: Custom Location Hook**
```tsx
import { useWeatherLocation } from '../hooks/useWeatherLocation';

function MyComponent() {
  const { weatherData, loading, error } = useWeatherLocation();
  
  if (loading) return <Text>Getting your location...</Text>;
  if (error) return <Text>Location error: {error}</Text>;
  
  return (
    <WeatherCard
      temperature={weatherData.temperature}
      condition={weatherData.condition}
      location={weatherData.location}
    />
  );
}
```

## 📱 **Required Permissions**

### **iOS (app.json)**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app uses location to show weather for your current area."
      }
    }
  }
}
```

### **Android (app.json)**
```json
{
  "expo": {
    "android": {
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

## 🧩 **Components Available**

### **1. WeatherCardWithLocation**
Full-featured weather card with automatic location detection:

```tsx
<WeatherCardWithLocation 
  showControls={true}     // Show refresh button
  autoFetch={true}        // Auto-fetch on mount
/>
```

**Features:**
- ✅ Automatic location detection
- ✅ Permission handling
- ✅ Error states with user-friendly messages
- ✅ Loading states
- ✅ Manual refresh capability
- ✅ Detailed location information

### **2. useLocation Hook**
Core location functionality:

```tsx
const { location, loading, error, requestLocation } = useLocation();
```

**Returns:**
- `location`: Coordinates and address information
- `loading`: Boolean loading state
- `error`: Error message if location fails
- `requestLocation`: Function to manually request location
- `hasPermission`: Permission status

### **3. useWeatherLocation Hook**
Combined location + weather data:

```tsx
const { weatherData, loading, error, refreshWeather } = useWeatherLocation();
```

**Returns:**
- `weatherData`: Complete weather information with location
- `loading`: Combined loading state
- `error`: Any location or weather errors
- `refreshWeather`: Function to refresh all data
- `locationData`: Raw location data

## 🎯 **Testing the Location Feature**

### **Navigate to Test Screen**
```bash
# In your app, navigate to:
/weather-test

# Then tap "My Location" button
```

### **Expected Flow**
1. **Permission Request**: App asks for location permission
2. **Loading State**: Shows "Getting your location..." with spinner
3. **Success State**: Displays weather card with your actual location
4. **Error Handling**: Clear error messages if something goes wrong

## 🔧 **Common Issues & Solutions**

### **"Location permission denied"**
**Solution:**
```tsx
// The component automatically handles this with user-friendly messages
// Users will see a "Settings Help" button to guide them
```

### **"Location services are disabled"**
**Solution:**
```tsx
// The hook detects this and shows appropriate error message
// Users need to enable location services in device settings
```

### **Slow location detection**
**Solution:**
```tsx
// The hook uses high accuracy mode but you can adjust:
const position = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced, // Change to Balanced for faster results
  timeInterval: 5000,                    // Increase timeout
});
```

### **No weather data**
**Solution:**
```tsx
// Currently uses demo weather data based on location
// To use real weather API, update useWeatherLocation.ts:

const fetchWeatherData = async (location: LocationData) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=YOUR_API_KEY`
  );
  return await response.json();
};
```

## 🌍 **Real Weather API Integration**

To integrate with a real weather service (OpenWeatherMap example):

### **1. Get API Key**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key

### **2. Update Environment Variables**
```bash
# .env.local
EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

### **3. Update useWeatherLocation Hook**
```tsx
// In hooks/useWeatherLocation.ts
const fetchWeatherData = async (location: LocationData): Promise<WeatherLocationData> => {
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Weather API request failed');
  }
  
  const data = await response.json();
  
  // Convert OpenWeatherMap data to our format
  return {
    temperature: Math.round(data.main.temp),
    condition: mapWeatherCondition(data.weather[0].main),
    location: data.name || location.formattedAddress,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    description: data.weather[0].description,
    coords: location,
  };
};

const mapWeatherCondition = (openWeatherCondition: string): WeatherCondition => {
  const conditionMap: { [key: string]: WeatherCondition } = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'snowy',
  };
  
  return conditionMap[openWeatherCondition] || 'cloudy';
};
```

## 📊 **Location Data Structure**

```typescript
interface LocationData {
  latitude: number;          // GPS coordinates
  longitude: number;
  address?: string;          // Street address
  city?: string;            // City name
  region?: string;          // State/province
  country?: string;         // Country name
  formattedAddress?: string; // Human-readable location
}

interface WeatherLocationData {
  temperature: number;       // Temperature in Celsius
  condition: WeatherCondition; // Weather type
  location: string;          // Display location name
  humidity?: number;         // Humidity percentage
  windSpeed?: number;        // Wind speed in km/h
  description?: string;      // Weather description
  coords?: {                // Original coordinates
    latitude: number;
    longitude: number;
  };
}
```

## 🎨 **Customization Examples**

### **Minimal Location Weather**
```tsx
<WeatherCardWithLocation 
  showControls={false}
  autoFetch={true}
/>
```

### **Manual Location Control**
```tsx
function CustomWeatherComponent() {
  const { weatherData, loading, refreshWeather } = useWeatherLocation(false);
  
  return (
    <View>
      <Button title="Get My Weather" onPress={refreshWeather} />
      {weatherData && (
        <WeatherCard
          temperature={weatherData.temperature}
          condition={weatherData.condition}
          location={weatherData.location}
        />
      )}
    </View>
  );
}
```

### **Location-Based Dashboard**
```tsx
function WeatherDashboard() {
  const { weatherData, locationData } = useWeatherLocation();
  
  return (
    <ScrollView>
      <WeatherCardWithLocation />
      
      {locationData && (
        <View style={styles.locationDetails}>
          <Text>Coordinates: {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}</Text>
          <Text>City: {locationData.city}</Text>
          <Text>Region: {locationData.region}</Text>
        </View>
      )}
    </ScrollView>
  );
}
```

The location-based weather system provides a seamless way to show relevant weather information to users based on their current position!
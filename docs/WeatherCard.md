# WeatherCard Component

A modern, animated weather card component for React Native that displays current weather conditions with dynamic gradients, smooth animations, and weather-specific visual effects.

## Features

✨ **Dynamic Backgrounds**: Weather-specific gradient backgrounds that change based on conditions  
🎮 **Smooth Animations**: Gentle bounce and pulse effects for engaging user experience  
🌟 **Weather Icons**: Large, animated weather icons using Ionicons  
💫 **Visual Effects**: Weather-specific effects like rain drops, snow flakes, and glowing sun  
🎨 **Modern Typography**: Clean, readable text with proper contrast  
📱 **Responsive Design**: Adapts to different screen sizes  
⚡ **TypeScript Support**: Fully typed for better development experience  

## Installation

The component uses the following dependencies that are already available in your project:
- `expo-linear-gradient` - For gradient backgrounds
- `@expo/vector-icons` - For weather icons
- `react-native` - Core React Native components

## Usage

### Basic Usage

```tsx
import WeatherCard from '../components/WeatherCard';

function MyScreen() {
  return (
    <WeatherCard
      temperature={24}
      condition="sunny"
      location="New York"
    />
  );
}
```

### With State Management

```tsx
import React, { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import { WeatherCondition } from '../types/weather';

function WeatherScreen() {
  const [weather, setWeather] = useState({
    temperature: 22,
    condition: 'cloudy' as WeatherCondition,
    location: 'Loading...',
  });

  useEffect(() => {
    // Fetch weather data from your API
    fetchWeatherData().then(data => {
      setWeather({
        temperature: data.temp,
        condition: mapWeatherCondition(data.condition),
        location: data.city,
      });
    });
  }, []);

  return (
    <WeatherCard
      temperature={weather.temperature}
      condition={weather.condition}
      location={weather.location}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `temperature` | `number` | Yes | - | Temperature in Celsius |
| `condition` | `WeatherCondition` | Yes | - | Weather condition type |
| `location` | `string` | No | `'Current Location'` | Location name to display |

### WeatherCondition Type

```typescript
type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'thunderstorm';
```

## Weather Conditions

### Sunny
- **Colors**: Yellow to orange gradient
- **Icon**: Sunny icon with glowing effect
- **Animation**: Pulsing glow around the sun icon

### Rainy
- **Colors**: Blue tones gradient
- **Icon**: Rainy icon
- **Animation**: Animated rain drops falling

### Cloudy
- **Colors**: Gray-blue gradient
- **Icon**: Cloud icon
- **Animation**: Gentle cloud movement

### Snowy
- **Colors**: Icy blue gradient
- **Icon**: Snow icon
- **Animation**: Floating snowflakes

### Thunderstorm
- **Colors**: Deep indigo with yellow accents
- **Icon**: Thunderstorm icon
- **Animation**: Lightning flicker effects

## Animations

The component includes several animation types:

1. **Icon Bounce**: Gentle scaling animation on the weather icon
2. **Gradient Pulse**: Subtle opacity animation on the background gradient
3. **Shadow Pulse**: Dynamic shadow intensity changes
4. **Weather Effects**: Condition-specific animations (rain, snow, etc.)

All animations are smooth and non-intrusive, using React Native's native driver for optimal performance.

## Styling

The component comes with built-in responsive styling that adapts to different screen sizes. Key style features:

- **Card Dimensions**: 85% of screen width, 220px height
- **Border Radius**: 24px for modern rounded corners
- **Shadows**: Platform-specific shadows (iOS/Android)
- **Typography**: Various font sizes with proper hierarchy
- **Colors**: High contrast white text over gradient backgrounds

## Customization

### Custom Weather Mapping

```tsx
// Map your API weather codes to WeatherCondition types
function mapApiWeatherToCondition(apiCode: string): WeatherCondition {
  switch (apiCode) {
    case '01d':
    case '01n':
      return 'sunny';
    case '09d':
    case '10d':
      return 'rainy';
    case '02d':
    case '03d':
    case '04d':
      return 'cloudy';
    case '13d':
      return 'snowy';
    case '11d':
      return 'thunderstorm';
    default:
      return 'cloudy';
  }
}
```

### Temperature Conversion

```tsx
// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5 / 9);
}

// Convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}
```

## Integration Examples

### Adding to Home Screen

```tsx
// In your home screen component
import WeatherCard from '../../components/WeatherCard';

// Add to your JSX
<ScrollView>
  {/* Other content */}
  
  <WeatherCard
    temperature={currentWeather.temperature}
    condition={currentWeather.condition}
    location={userLocation}
  />
  
  {/* Other content */}
</ScrollView>
```

### Multiple Cards

```tsx
function WeatherDashboard() {
  const locations = [
    { name: 'New York', temp: 22, condition: 'cloudy' },
    { name: 'London', temp: 15, condition: 'rainy' },
    { name: 'Tokyo', temp: 28, condition: 'sunny' },
  ];

  return (
    <ScrollView>
      {locations.map((location, index) => (
        <WeatherCard
          key={index}
          temperature={location.temp}
          condition={location.condition}
          location={location.name}
        />
      ))}
    </ScrollView>
  );
}
```

## API Integration

### OpenWeatherMap Example

```tsx
const WEATHER_API_KEY = 'your-api-key';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeatherData(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: mapOpenWeatherToCondition(data.weather[0].main),
      location: data.name,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

function mapOpenWeatherToCondition(condition: string): WeatherCondition {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sunny';
    case 'rain':
    case 'drizzle':
      return 'rainy';
    case 'clouds':
      return 'cloudy';
    case 'snow':
      return 'snowy';
    case 'thunderstorm':
      return 'thunderstorm';
    default:
      return 'cloudy';
  }
}
```

## Performance Tips

1. **Memoization**: Use `React.memo` if re-rendering frequently
2. **Animation Control**: Animations automatically stop when component unmounts
3. **Image Caching**: Icons are vector-based for optimal performance
4. **Native Driver**: All animations use native driver for 60fps performance

## Accessibility

The component includes basic accessibility features:
- Semantic text content
- Proper color contrast
- Screen reader friendly

## Troubleshooting

### Common Issues

**Icons not displaying:**
- Ensure `@expo/vector-icons` is installed
- Check that the icon names match Ionicons

**Gradients not showing:**
- Verify `expo-linear-gradient` is installed
- Check for any styling conflicts

**Animations stuttering:**
- Ensure React Native debugger is disabled in production
- Check device performance

### Debug Mode

Add this to enable debug logging:

```tsx
// Add to WeatherCard component
console.log('WeatherCard rendered:', { temperature, condition, location });
```

## License

This component is part of your SECUREIN project and follows the same license terms.
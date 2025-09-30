// types/weather.ts
export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  location?: string;
  humidity?: number;
  windSpeed?: number;
  uvIndex?: number;
}

export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'thunderstorm';

export interface WeatherCardProps {
  temperature: number;
  condition: WeatherCondition;
  location?: string;
}

export interface WeatherConfig {
  gradient: readonly [string, string, string];
  icon: string;
  label: string;
  iconColor: string;
}

export type WeatherConfigMap = {
  [key in WeatherCondition]: WeatherConfig;
};
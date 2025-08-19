/**
 * Weather Notification Messages System
 * 
 * Provides funny, engaging weather messages for different weather conditions.
 * Each condition has multiple messages that rotate daily to keep content fresh.
 */

// Define weather conditions type
export type WeatherCondition = 
  | 'sunny' 
  | 'partly-cloudy' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'foggy';

// Configuration interface for weather notifications  
export interface WeatherNotificationConfig {
  sunny: string[];
  'partly-cloudy': string[];
  cloudy: string[];
  rainy: string[];
  stormy: string[];
  snowy: string[];
  foggy: string[];
}

// Available weather conditions array
export const WEATHER_CONDITIONS: WeatherCondition[] = [
  'sunny',
  'partly-cloudy', 
  'cloudy',
  'rainy',
  'stormy',
  'snowy',
  'foggy'
];

// Weather notification messages - 5 messages per condition for variety
export const weatherNotificationMessages: WeatherNotificationConfig = {
  "sunny": [
    "☀️ Perfect day for outdoor adventures await!",
    "🌞 Sunshine's painting the world golden today!",
    "☀️ Sun's showing off - wear your shades!",
    "🌅 Mother Nature's spotlight is fully on!",
    "☀️ Vitamin D delivery service in full swing!"
  ],
  "partly-cloudy": [
    "⛅ Weather can't decide today - like choosing breakfast!",
    "🌤️ Sun and clouds playing peek-a-boo beautifully!",
    "⛅ Nature's mood ring showing mixed feelings!",
    "🌤️ Perfect mix - not too hot, not too cold!",
    "⛅ Clouds providing natural air conditioning today!"
  ],
  "cloudy": [
    "☁️ Sky's wearing its cozy gray sweater today!",
    "🌥️ Clouds gathered for their weekly meeting upstairs!",
    "☁️ Nature's soft lighting filter is active!",
    "🌫️ Sky decided to go minimalist - all gray!",
    "☁️ Perfect reading weather with natural mood lighting!"
  ],
  "rainy": [
    "🌧️ Nature's shower time - plants are dancing!",
    "☔ Sky's doing the dishes - splash zone active!",
    "💧 Free car wash courtesy of Mother Nature!",
    "🌧️ Perfect excuse for indoor cozy time!",
    "☔ Raindrops are nature's percussion section today!"
  ],
  "stormy": [
    "⛈️ Thor's having a temper tantrum up there!",
    "🌩️ Lightning photography class in session outside!",
    "⚡ Nature's light show - front row seats indoors recommended.",
    "🌪️ Wind's auditioning for superhero movie today!",
    "⛈️ Storm clouds practicing dramatic entrance skills."
  ],
  "snowy": [
    "❄️ Snowflakes are nature's confetti - celebration time!",
    "⛄ Perfect snowman building weather - carrot ready?",
    "🌨️ Sky's dandruff problem is everyone's winter wonderland!",
    "❄️ Each snowflake unique - just like fingerprints!",
    "☃️ Winter's glitter bomb exploded over everything!"
  ],
  "foggy": [
    "🌫️ Fog rolled in like nature's magic trick!",
    "👻 Spooky visibility - perfect for hide and seek.",
    "🌁 Clouds decided to visit ground level today!",
    "🌫️ Mother Nature using soft focus filter today."
  ]
};

/**
 * Maps weather condition strings to notification message keys
 * @param weatherCondition - The weather condition string from weather API
 * @returns The appropriate key for weatherNotificationMessages
 */
export function mapWeatherConditionToNotificationKey(weatherCondition: string): WeatherCondition {
  const condition = weatherCondition?.toLowerCase() || '';
  
  if (condition.includes('clear') || condition.includes('sunny')) {
    return 'sunny';
  } else if (condition.includes('partly') || condition.includes('few clouds')) {
    return 'partly-cloudy';
  } else if (condition.includes('cloud') || condition.includes('overcast')) {
    return 'cloudy';
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice') || condition.includes('hail') || condition.includes('blizzard')) {
    return 'snowy';
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    return 'stormy';
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    return 'rainy';
  } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    return 'foggy';
  } else {
    // Default fallback
    return 'partly-cloudy';
  }
}

/**
 * Gets a consistent daily weather message based on weather condition
 * Returns the same message throughout the day for consistency
 * @param weatherCondition - The weather condition string
 * @returns A weather notification message
 */
export function getWeatherNotificationMessage(weatherCondition: string): string {
  const key = mapWeatherConditionToNotificationKey(weatherCondition);
  const messages = weatherNotificationMessages[key];
  
  if (!messages || messages.length === 0) {
    return "🌤️ Weather update: Nature's doing its thing!";
  }
  
  // Use date-based selection for consistency throughout the day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const messageIndex = dayOfYear % messages.length;
  
  return messages[messageIndex];
}

/**
 * Gets a random weather message for variety
 * @param weatherCondition - The weather condition string  
 * @returns A random weather notification message
 */
export function getRandomWeatherNotificationMessage(weatherCondition: string): string {
  const key = mapWeatherConditionToNotificationKey(weatherCondition);
  const messages = weatherNotificationMessages[key];
  
  if (!messages || messages.length === 0) {
    return "🌤️ Weather update: Nature's doing its thing!";
  }
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

/**
 * Gets all messages for a specific weather condition
 * @param condition - The weather condition key
 * @returns Array of all messages for the condition
 */
export function getAllWeatherNotificationMessages(condition: WeatherCondition): string[] {
  return weatherNotificationMessages[condition] || [];
}

/**
 * Gets a specific message by condition and index
 * @param condition - The weather condition key
 * @param index - The message index
 * @returns The specific message or fallback
 */
export function getWeatherNotificationByKey(condition: WeatherCondition, index: number): string {
  const messages = weatherNotificationMessages[condition];
  
  if (!messages || messages.length === 0 || index < 0 || index >= messages.length) {
    return "🌤️ Weather update: Nature's doing its thing!";
  }
  
  return messages[index];
}
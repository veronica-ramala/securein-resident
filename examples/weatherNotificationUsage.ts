/**
 * Weather Notification Usage Examples
 * 
 * This file demonstrates how to use the weather notification system
 * in different parts of your app, including push notifications,
 * alerts, and UI components.
 */

import { 
  getWeatherNotificationMessage, 
  getRandomWeatherNotificationMessage,
  getAllWeatherNotificationMessages,
  getWeatherNotificationByKey,
  mapWeatherConditionToNotificationKey,
  WEATHER_CONDITIONS,
  type WeatherCondition
} from '../utils/weatherNotifications';

// Example 1: Basic usage with weather condition from API
export function showWeatherAlert(weatherCondition: string) {
  const message = getWeatherNotificationMessage(weatherCondition);
  
  // Use in your notification/alert system
  console.log('Weather Alert:', message);
  
  // Example with React Native Alert
  // Alert.alert('Weather Update', message);
  
  // Example with push notification
  // PushNotification.localNotification({
  //   title: 'Weather Update',
  //   message: message,
  //   playSound: true,
  //   soundName: 'default',
  // });
}

// Example 2: Push notification service integration
export class WeatherPushNotificationService {
  static async scheduleWeatherNotification(weatherData: any) {
    const message = getWeatherNotificationMessage(weatherData.condition);
    
    // Example with Expo Notifications
    /*
    import * as Notifications from 'expo-notifications';
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌤️ Weather Update',
        body: message,
        sound: true,
        priority: Notifications.AndroidImportance.DEFAULT,
      },
      trigger: {
        seconds: 1, // Send immediately
      },
    });
    */
    
    console.log('Scheduled weather notification:', message);
    return message;
  }
  
  static async sendRandomWeatherTip(weatherCondition: string) {
    const message = getRandomWeatherNotificationMessage(weatherCondition);
    
    // Send as a fun weather tip notification
    console.log('Weather Tip:', message);
    return message;
  }
}

// Example 3: Daily weather message widget
export class DailyWeatherWidget {
  static getDailyMessage(weatherCondition: string): string {
    // This will return the same message throughout the day
    return getWeatherNotificationMessage(weatherCondition);
  }
  
  static getWeeklyMessages(weatherConditions: string[]): string[] {
    return weatherConditions.map(condition => 
      getWeatherNotificationMessage(condition)
    );
  }
}

// Example 4: Weather condition checker
export class WeatherConditionChecker {
  static checkConditionAndAlert(currentWeather: string, previousWeather?: string) {
    const currentMessage = getWeatherNotificationMessage(currentWeather);
    
    if (previousWeather && previousWeather !== currentWeather) {
      // Weather changed, send update
      console.log('Weather changed!', currentMessage);
      return {
        changed: true,
        message: currentMessage,
        condition: mapWeatherConditionToNotificationKey(currentWeather)
      };
    }
    
    return {
      changed: false,
      message: currentMessage,
      condition: mapWeatherConditionToNotificationKey(currentWeather)
    };
  }
}

// Example 5: Batch processing weather messages
export class WeatherMessageBatch {
  static getAllMessagesForCondition(condition: WeatherCondition): string[] {
    return getAllWeatherNotificationMessages(condition);
  }
  
  static getMessageRotation(condition: WeatherCondition, rotationIndex: number): string {
    const messages = getAllWeatherNotificationMessages(condition);
    if (messages.length === 0) return "🌤️ Weather update: Nature's doing its thing!";
    
    return messages[rotationIndex % messages.length];
  }
  
  static preloadAllMessages(): Record<WeatherCondition, string[]> {
    const allMessages: Record<string, string[]> = {};
    
    WEATHER_CONDITIONS.forEach(condition => {
      allMessages[condition] = getAllWeatherNotificationMessages(condition);
    });
    
    return allMessages as Record<WeatherCondition, string[]>;
  }
}

// Example 6: Integration with weather service
export class WeatherNotificationIntegration {
  private static lastNotificationTime: Date | null = null;
  private static lastWeatherCondition: string | null = null;
  
  static async processWeatherUpdate(weatherData: {
    condition: string;
    temperature: number;
    location: string;
    timestamp: Date;
  }) {
    const now = new Date();
    const shouldNotify = this.shouldSendNotification(weatherData.condition, now);
    
    if (shouldNotify) {
      const message = getWeatherNotificationMessage(weatherData.condition);
      
      // Send notification
      await this.sendNotification({
        title: `Weather in ${weatherData.location}`,
        body: message,
        data: {
          temperature: weatherData.temperature,
          condition: weatherData.condition,
          location: weatherData.location,
        }
      });
      
      this.lastNotificationTime = now;
      this.lastWeatherCondition = weatherData.condition;
    }
    
    return shouldNotify;
  }
  
  private static shouldSendNotification(condition: string, currentTime: Date): boolean {
    // Don't spam notifications - limit to once per hour
    if (this.lastNotificationTime) {
      const hoursSinceLastNotification = 
        (currentTime.getTime() - this.lastNotificationTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastNotification < 1) return false;
    }
    
    // Send notification if condition changed or it's first time
    return !this.lastWeatherCondition || this.lastWeatherCondition !== condition;
  }
  
  private static async sendNotification(notification: {
    title: string;
    body: string;
    data: any;
  }) {
    // Implementation depends on your notification service
    console.log('Sending weather notification:', notification);
    
    // Example with Expo Notifications:
    /*
    import * as Notifications from 'expo-notifications';
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
    */
  }
}

// Example 7: Simple usage examples
export const weatherNotificationExamples = {
  // Get today's message for sunny weather
  getTodaysSunnyMessage: () => getWeatherNotificationMessage('Clear Sky'),
  
  // Get a random rainy message
  getRandomRainyMessage: () => getRandomWeatherNotificationMessage('Heavy Rain'),
  
  // Get specific message by index
  getSpecificMessage: (condition: WeatherCondition, index: number) => 
    getWeatherNotificationByKey(condition, index),
  
  // Map API response to our system
  mapApiResponse: (apiCondition: string) => 
    mapWeatherConditionToNotificationKey(apiCondition),
  
  // Demonstrate all conditions
  showAllConditions: () => {
    WEATHER_CONDITIONS.forEach(condition => {
      console.log(`${condition}:`, getWeatherNotificationByKey(condition, 0));
    });
  }
};

// Usage in React Native component example:
/*
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getWeatherNotificationMessage } from '../utils/weatherNotifications';

export const WeatherMessageComponent = ({ weatherCondition }) => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (weatherCondition) {
      const weatherMessage = getWeatherNotificationMessage(weatherCondition);
      setMessage(weatherMessage);
    }
  }, [weatherCondition]);
  
  return (
    <View style={{ padding: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10 }}>
      <Text style={{ color: 'white', textAlign: 'center', fontStyle: 'italic' }}>
        {message}
      </Text>
    </View>
  );
};
*/
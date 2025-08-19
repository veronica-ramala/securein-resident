import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WeatherCardProps, WeatherCondition, WeatherConfigMap } from '../types/weather';

const { width } = Dimensions.get('window');

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location = 'Current Location'
}) => {
  // Enhanced Animation values
  const iconBounce = useRef(new Animated.Value(1)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const gradientOpacity = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.15)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;
  const tempPulse = useRef(new Animated.Value(1)).current;
  
  // Weather effect animations
  const rainDrops = useRef(
    Array.from({ length: 6 }, () => ({
      translateY: new Animated.Value(-100),
      opacity: new Animated.Value(0),
    }))
  ).current;
  
  const snowFlakes = useRef(
    Array.from({ length: 8 }, () => ({
      translateY: new Animated.Value(-50),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }))
  ).current;
  
  const sunRays = useRef(
    Array.from({ length: 8 }, () => ({
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0.3),
      rotation: new Animated.Value(0),
    }))
  ).current;
  
  const clouds = useRef(
    Array.from({ length: 3 }, () => ({
      translateX: new Animated.Value(-50),
      opacity: new Animated.Value(0.4),
      scale: new Animated.Value(0.8),
    }))
  ).current;
  
  const lightningFlash = useRef(new Animated.Value(0)).current;

  // Weather condition configurations
  const weatherConfig: WeatherConfigMap = {
    sunny: {
      gradient: ['#FFD93D', '#FF8C42', '#FF6B35'] as const,
      icon: 'sunny',
      label: 'Sunny',
      iconColor: '#FFF8DC',
    },
    rainy: {
      gradient: ['#4A90E2', '#357ABD', '#1E5A96'] as const,
      icon: 'rainy',
      label: 'Rainy',
      iconColor: '#E8F4FD',
    },
    cloudy: {
      gradient: ['#8DA5C4', '#6B7D95', '#4A5C6A'] as const,
      icon: 'cloudy',
      label: 'Cloudy',
      iconColor: '#F0F4F7',
    },
    snowy: {
      gradient: ['#B8E0FF', '#7CC7FF', '#4A9EFF'] as const,
      icon: 'snow',
      label: 'Snowy',
      iconColor: '#FFFFFF',
    },
    thunderstorm: {
      gradient: ['#2C3E50', '#34495E', '#F39C12'] as const,
      icon: 'thunderstorm',
      label: 'Thunderstorm',
      iconColor: '#FFD700',
    },
  };

  const currentWeather = weatherConfig[condition];

  // Enhanced animation effects
  useEffect(() => {
    // Card entrance animation
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.98,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Dramatic icon bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: 1.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    // Temperature pulse animation
    const tempAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(tempPulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(tempPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    tempAnimation.start();

    // Dramatic gradient pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(gradientOpacity, {
          toValue: 0.7,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Enhanced shadow animation
    const shadowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowOpacity, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(shadowOpacity, {
          toValue: 0.15,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    shadowAnimation.start();

    // Start weather-specific animations
    startWeatherAnimations();

    return () => {
      bounceAnimation.stop();
      tempAnimation.stop();
      pulseAnimation.stop();
      shadowAnimation.stop();
    };
  }, [condition]);

  const startWeatherAnimations = () => {
    switch (condition) {
      case 'sunny':
        startSunAnimation();
        break;
      case 'rainy':
        startRainAnimation();
        break;
      case 'cloudy':
        startCloudAnimation();
        break;
      case 'snowy':
        startSnowAnimation();
        break;
      case 'thunderstorm':
        startThunderstormAnimation();
        break;
    }
  };

  const startSunAnimation = () => {
    // Rotating sun rays
    Animated.loop(
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing sun rays
    sunRays.forEach((ray, index) => {
      const rayAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(ray.scale, {
            toValue: 1.5,
            duration: 1500 + index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(ray.scale, {
            toValue: 0.8,
            duration: 1500 + index * 200,
            useNativeDriver: true,
          }),
        ])
      );
      rayAnimation.start();

      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(ray.opacity, {
            toValue: 0.8,
            duration: 1000 + index * 150,
            useNativeDriver: true,
          }),
          Animated.timing(ray.opacity, {
            toValue: 0.2,
            duration: 1000 + index * 150,
            useNativeDriver: true,
          }),
        ])
      );
      opacityAnimation.start();
    });
  };

  const startRainAnimation = () => {
    rainDrops.forEach((drop, index) => {
      const animateRain = () => {
        drop.translateY.setValue(-100);
        drop.opacity.setValue(0);

        Animated.parallel([
          Animated.timing(drop.translateY, {
            toValue: 400,
            duration: 1000 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(drop.opacity, {
              toValue: 0.9,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(drop.opacity, {
              toValue: 0,
              duration: 200,
              delay: 600,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateRain());
      };

      setTimeout(() => animateRain(), index * 200);
    });
  };

  const startSnowAnimation = () => {
    snowFlakes.forEach((flake, index) => {
      const animateSnow = () => {
        flake.translateY.setValue(-50);
        flake.translateX.setValue((Math.random() - 0.5) * 100);
        flake.opacity.setValue(0);
        flake.scale.setValue(0.5);

        Animated.parallel([
          Animated.timing(flake.translateY, {
            toValue: 400,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(flake.translateX, {
            toValue: flake.translateX._value + (Math.random() - 0.5) * 150,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(flake.opacity, {
              toValue: 0.9,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(flake.opacity, {
              toValue: 0,
              duration: 1000,
              delay: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.loop(
            Animated.sequence([
              Animated.timing(flake.scale, {
                toValue: 1.2,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(flake.scale, {
                toValue: 0.5,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start(() => animateSnow());
      };

      setTimeout(() => animateSnow(), index * 300);
    });
  };

  const startCloudAnimation = () => {
    clouds.forEach((cloud, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cloud.translateX, {
            toValue: 150,
            duration: 8000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(cloud.translateX, {
            toValue: -50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(cloud.opacity, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(cloud.opacity, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const startThunderstormAnimation = () => {
    // Start cloud animation
    startCloudAnimation();

    // Lightning flash effect
    const flashLightning = () => {
      Animated.sequence([
        Animated.timing(lightningFlash, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0.8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(flashLightning, 3000 + Math.random() * 4000);
      });
    };

    flashLightning();
  };

  const sunRotation = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: shadowOpacity }]}>
      <Animated.View style={[
        styles.card, 
        { 
          opacity: gradientOpacity,
          transform: [{ scale: cardScale }]
        }
      ]}>
        <LinearGradient
          colors={currentWeather.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Lightning Flash Overlay for thunderstorm */}
          {condition === 'thunderstorm' && (
            <Animated.View 
              style={[
                styles.lightningOverlay,
                { opacity: lightningFlash }
              ]}
            />
          )}

          {/* Sun rays for sunny weather */}
          {condition === 'sunny' && (
            <View style={styles.sunRaysContainer}>
              {sunRays.map((ray, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.sunRay,
                    {
                      transform: [
                        { scale: ray.scale },
                        { rotate: `${index * 45}deg` }
                      ],
                      opacity: ray.opacity,
                    }
                  ]}
                />
              ))}
            </View>
          )}

          {/* Floating clouds for cloudy/thunderstorm weather */}
          {(condition === 'cloudy' || condition === 'thunderstorm') && (
            <View style={styles.cloudsContainer}>
              {clouds.map((cloud, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.floatingCloud,
                    {
                      transform: [
                        { translateX: cloud.translateX },
                        { scale: cloud.scale }
                      ],
                      opacity: cloud.opacity,
                      top: 20 + index * 15,
                    }
                  ]}
                />
              ))}
            </View>
          )}

          {/* Weather Icon */}
          <Animated.View 
            style={[
              styles.iconContainer,
              { 
                transform: [
                  { scale: iconBounce },
                  ...(condition === 'sunny' ? [{ rotate: sunRotation }] : [])
                ]
              }
            ]}
          >
            <Ionicons
              name={currentWeather.icon as keyof typeof Ionicons.glyphMap}
              size={80}
              color={currentWeather.iconColor}
            />
            {/* Enhanced glowing effect for sunny weather */}
            {condition === 'sunny' && (
              <Animated.View style={[styles.glowEffect, { opacity: gradientOpacity }]} />
            )}
          </Animated.View>

          {/* Temperature with pulse animation */}
          <Animated.View style={{ transform: [{ scale: tempPulse }] }}>
            <Text style={styles.temperature}>
              {Math.round(temperature)}°
            </Text>
          </Animated.View>

          {/* Weather Condition */}
          <Text style={styles.condition}>
            {currentWeather.label}
          </Text>

          {/* Location (optional) */}
          {location && (
            <Text style={styles.location}>
              {location}
            </Text>
          )}

          {/* Enhanced rain drops */}
          {condition === 'rainy' && (
            <View style={styles.rainEffect}>
              {rainDrops.map((drop, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.rainDrop,
                    {
                      transform: [{ translateY: drop.translateY }],
                      opacity: drop.opacity,
                      left: 30 + index * 45,
                    }
                  ]}
                />
              ))}
            </View>
          )}

          {/* Enhanced snow flakes */}
          {condition === 'snowy' && (
            <View style={styles.snowEffect}>
              {snowFlakes.map((flake, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.snowFlake,
                    {
                      transform: [
                        { translateY: flake.translateY },
                        { translateX: flake.translateX },
                        { scale: flake.scale }
                      ],
                      opacity: flake.opacity,
                      left: 20 + (index % 4) * 60,
                      top: 20 + (index % 3) * 30,
                    }
                  ]}
                />
              ))}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    width: width * 0.85,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 10,
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: '#FFD700',
    borderRadius: 60,
    opacity: 0.4,
    zIndex: -1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 10,
  },
  condition: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.5,
    marginBottom: 8,
    zIndex: 10,
  },
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    zIndex: 10,
  },
  // Lightning overlay for thunderstorm
  lightningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  // Sun rays for sunny weather
  sunRaysContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginTop: -60,
    marginLeft: -60,
    zIndex: 1,
  },
  sunRay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 4,
    height: 40,
    backgroundColor: '#FFD700',
    marginTop: -50,
    marginLeft: -2,
    borderRadius: 2,
    opacity: 0.6,
  },
  // Floating clouds
  cloudsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  floatingCloud: {
    position: 'absolute',
    width: 60,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
  },
  // Enhanced rain effect
  rainEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
  },
  rainDrop: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: 'rgba(135, 206, 250, 0.8)',
    borderRadius: 2,
    top: -20,
  },
  // Enhanced snow effect
  snowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
  },
  snowFlake: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    shadowOpacity: 1,
  },
});

export default WeatherCard;
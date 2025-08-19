import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import { Shield, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, UserPlus, ShieldAlert, Key, Store, Building, MapPin, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Thermometer, Heart, Bell, CloudOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../context/LocalizationContext';
import { wp, hp, fontSize, spacing, s, vs, ms, RF, getResponsiveText, getLineHeight, isVerySmallDevice, isSmallDevice } from '../../utils/responsive';
import { getWeatherNotificationMessage, mapWeatherConditionToNotificationKey } from '../../utils/weatherNotifications';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

// Custom Community Gate Icon Component
const CommunityGateIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Gate posts */}
      <Rect x="3" y="4" width="3" height="16" />
      <Rect x="18" y="4" width="3" height="16" />
      
      {/* Gate bars */}
      <Path d="M6 8 L18 8" />
      <Path d="M6 12 L18 12" />
      <Path d="M6 16 L18 16" />
      
      {/* Gate frame */}
      <Path d="M6 4 L18 4" />
      <Path d="M6 20 L18 20" />
      <Path d="M9 4 L9 20" strokeWidth={1.5} />
      <Path d="M15 4 L15 20" strokeWidth={1.5} />
    </Svg>
  );
};

// Custom Shuttle Racket Icon Component
const ShuttleRacketIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Racket handle */}
      <Path d="M12 20 L12 14" />
      
      {/* Racket head */}
      <Ellipse cx="12" cy="8" rx="6" ry="7" />
      
      {/* Racket strings - vertical */}
      <Path d="M9 3 L9 13" strokeWidth={1} />
      <Path d="M12 2 L12 14" strokeWidth={1} />
      <Path d="M15 3 L15 13" strokeWidth={1} />
      
      {/* Racket strings - horizontal */}
      <Path d="M7 5 L17 5" strokeWidth={1} />
      <Path d="M6 8 L18 8" strokeWidth={1} />
      <Path d="M7 11 L17 11" strokeWidth={1} />
      
      {/* Shuttle */}
      <Circle cx="18" cy="18" r="1.5" />
      <Path d="M18 16.5 L19 15 L20 15.5 L19.5 16.5 L18 16.5" fill={color} strokeWidth={1} />
    </Svg>
  );
};

// Custom Community Map Icon Component
const CommunityMapIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Map outline */}
      <Path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3" />
      
      {/* Roads */}
      <Path d="M9 3v15" strokeWidth={1.5} />
      <Path d="M15 6v15" strokeWidth={1.5} />
      <Path d="M5 10h4" strokeWidth={1.5} />
      <Path d="M15 10h4" strokeWidth={1.5} />
      <Path d="M7 14h10" strokeWidth={1.5} />
      
      {/* Location pin */}
      <Circle cx="12" cy="10" r="1.5" fill={color} />
    </Svg>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useLocalization();

  // Weather-related state
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Weather animation values
  const rainAnimations = useRef(
    Array.from({ length: 15 }, () => ({
      translateY: new Animated.Value(-100),
      opacity: new Animated.Value(0),
    }))
  ).current;
  
  const snowAnimations = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-50),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;
  
  const sunRayAnimations = useRef(
    Array.from({ length: 8 }, () => ({
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0.3),
    }))
  ).current;
  
  const cloudAnimations = useRef(
    Array.from({ length: 3 }, () => ({
      translateX: new Animated.Value(-50),
      opacity: new Animated.Value(0.7),
    }))
  ).current;

  // Enhanced animation functions
  const startWeatherAnimations = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    
    // Fade in main weather content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Slide in hourly forecast items with stagger
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start();
    
    // Start weather effect animations based on current weather
    if (weatherData?.icon) {
      startWeatherEffectAnimations(weatherData.icon);
    }
  };

  // Weather effect animations
  const startWeatherEffectAnimations = (weatherType: string) => {
    // Stop all current animations
    rainAnimations.forEach(anim => {
      anim.translateY.stopAnimation();
      anim.opacity.stopAnimation();
    });
    snowAnimations.forEach(anim => {
      anim.translateY.stopAnimation();
      anim.translateX.stopAnimation();
      anim.opacity.stopAnimation();
    });
    sunRayAnimations.forEach(anim => {
      anim.scale.stopAnimation();
      anim.opacity.stopAnimation();
    });
    cloudAnimations.forEach(anim => {
      anim.translateX.stopAnimation();
      anim.opacity.stopAnimation();
    });

    switch (weatherType) {
      case 'rainy':
        startRainAnimation();
        break;
      case 'snowy':
        startSnowAnimation();
        break;
      case 'sunny':
        startSunAnimation();
        break;
      case 'cloudy':
      case 'partly-cloudy':
        startCloudAnimation();
        break;
      case 'stormy':
        startStormAnimation();
        break;
    }
  };

  const startRainAnimation = () => {
    rainAnimations.forEach((anim, index) => {
      const animateRainDrop = () => {
        anim.translateY.setValue(-100);
        anim.opacity.setValue(0);
        
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: 300,
            duration: 1000 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 0.8,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 100,
              delay: 800,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateRainDrop());
      };
      
      setTimeout(() => animateRainDrop(), index * 100);
    });
  };

  const startSnowAnimation = () => {
    snowAnimations.forEach((anim, index) => {
      const animateSnowFlake = () => {
        anim.translateY.setValue(-50);
        anim.translateX.setValue(Math.random() * 20 - 10);
        anim.opacity.setValue(0);
        
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: 300,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: Math.random() * 40 - 20,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 0.9,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 500,
              delay: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animateSnowFlake());
      };
      
      setTimeout(() => animateSnowFlake(), index * 150);
    });
  };

  const startSunAnimation = () => {
    sunRayAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.opacity, {
            toValue: 0.8,
            duration: 1500 + index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0.3,
            duration: 1500 + index * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const startCloudAnimation = () => {
    cloudAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.translateX, {
            toValue: 100,
            duration: 8000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: -50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const startStormAnimation = () => {
    // Combine cloud and lightning effects
    startCloudAnimation();
    
    sunRayAnimations.forEach((anim, index) => {
      const randomFlicker = () => {
        Animated.sequence([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0.2,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(randomFlicker, 2000 + Math.random() * 3000);
        });
      };
      
      setTimeout(randomFlicker, index * 500);
    });
  };

  // Get weather gradient colors based on condition - Enhanced and more realistic
  const getWeatherGradient = (iconType: string) => {
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 20;
    const isEvening = currentHour >= 17 && currentHour <= 20;
    const isMorning = currentHour >= 6 && currentHour <= 9;

    if (isNight) {
      return {
        colors: ['#1E1B4B', '#3730A3', '#5B21B6'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      };
    }

    if (isEvening) {
      // Sunset colors for evening
      switch (iconType) {
        case 'sunny':
          return {
            colors: ['#FEF3C7', '#FCD34D', '#F59E0B'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
          };
        default:
          return {
            colors: ['#FDF2F8', '#FCE7F3', '#F3E8FF'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
          };
      }
    }

    switch (iconType) {
      case 'sunny':
        return {
          colors: isMorning 
            ? ['#FEF9C3', '#FEF08A', '#FACC15'] // Morning sunshine
            : ['#FFFBEB', '#FEF3C7', '#F59E0B'], // Midday sunshine
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'cloudy':
        return {
          colors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'partly-cloudy':
        return {
          colors: ['#FEFCE8', '#FEF9C3', '#E0F2FE'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'rainy':
        return {
          colors: ['#DBEAFE', '#93C5FD', '#3B82F6'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'snowy':
        return {
          colors: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'stormy':
        return {
          colors: ['#475569', '#334155', '#1E293B'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'foggy':
        return {
          colors: ['#F9FAFB', '#F3F4F6', '#E5E7EB'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      default:
        return {
          colors: ['#F0F9FF', '#E0F2FE', '#DBEAFE'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
    }
  };

  // Get text colors based on weather condition and time
  const getWeatherTextColor = (iconType: string) => {
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 20;
    
    if (isNight) {
      return '#F8FAFC'; // Light text for dark night gradients
    }
    
    switch (iconType) {
      case 'sunny':
        return '#92400E'; // Warm brown for sunny weather
      case 'rainy':
        return '#1E40AF'; // Deep blue for rainy weather
      case 'snowy':
        return '#374151'; // Dark grey for snowy weather
      case 'stormy':
        return '#F8FAFC'; // Light text for dark storm gradients
      case 'cloudy':
      case 'partly-cloudy':
        return '#1E40AF'; // Blue for cloudy weather
      default:
        return '#1E293B'; // Default dark text
    }
  };

  // Get subtext colors (lighter than main text)
  const getWeatherSubtextColor = (iconType: string) => {
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 20;
    
    if (isNight) {
      return '#CBD5E1'; // Light grey for dark backgrounds
    }
    
    switch (iconType) {
      case 'sunny':
        return '#A16207'; // Warm amber for sunny weather
      case 'rainy':
        return '#2563EB'; // Medium blue for rainy weather
      case 'snowy':
        return '#6B7280'; // Medium grey for snowy weather
      case 'stormy':
        return '#E2E8F0'; // Light grey for storm backgrounds
      case 'cloudy':
      case 'partly-cloudy':
        return '#3B82F6'; // Lighter blue for cloudy weather
      default:
        return '#64748B'; // Default grey
    }
  };

  // Get stats background color
  const getWeatherStatsBackground = (iconType: string) => {
    const currentHour = new Date().getHours();
    const isNight = currentHour < 6 || currentHour > 20;
    
    if (isNight) {
      return 'rgba(51, 65, 85, 0.3)'; // Dark semi-transparent for night
    }
    
    switch (iconType) {
      case 'sunny':
        return 'rgba(252, 211, 77, 0.2)'; // Warm yellow tint
      case 'rainy':
        return 'rgba(147, 197, 253, 0.3)'; // Blue tint
      case 'snowy':
        return 'rgba(241, 245, 249, 0.8)'; // Light grey tint
      case 'stormy':
        return 'rgba(71, 85, 105, 0.3)'; // Dark grey tint
      case 'cloudy':
      case 'partly-cloudy':
        return 'rgba(186, 230, 253, 0.4)'; // Light blue tint
      default:
        return 'rgba(248, 250, 252, 0.8)'; // Default light background
    }
  };

  // Function to retry location and weather
  const retryLocationAndWeather = async () => {
    console.log('Retrying location and weather...');
    setWeatherLoading(true);
    setWeatherError(null);
    
    // Start pulse animation for loading state
    startPulseAnimation();
    
    // Get user's location again
    const currentLocation = await requestLocationPermission();
    
    if (currentLocation) {
      console.log('Retry: Fetching weather for coordinates:', currentLocation.coords.latitude, currentLocation.coords.longitude);
      await fetchWeatherData(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } else {
      console.log('Retry: Location still unavailable, using default location');
      try {
        const defaultLat = 28.6139; // New Delhi latitude
        const defaultLon = 77.2090; // New Delhi longitude
        await fetchFreeWeatherData(defaultLat, defaultLon);
        setWeatherError('Using default location. Enable location access for local weather.');
      } catch (fallbackError) {
        console.error('Retry fallback weather also failed:', fallbackError);
        setWeatherError('Weather service temporarily unavailable');
        setWeatherLoading(false);
      }
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Function to get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return t('features.goodMorning');
    } else if (hour >= 12 && hour < 18) {
      return t('features.goodAfternoon');
    } else {
      return t('features.goodEvening');
    }
  };

  // Multilingual motivational quotes
  const motivationalQuotes = {
    en: [
      "The only way to do great work is to love what you do.",
      "Believe you can and you're halfway there.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Your attitude determines your direction.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "You are never too old to set another goal or to dream a new dream.",
      "The secret of getting ahead is getting started.",
      "Quality is not an act, it is a habit.",
      "Every accomplishment starts with the decision to try.",
      "Don't watch the clock; do what it does. Keep going.",
      "The only limit to our realization of tomorrow is our doubts of today.",
      "It always seems impossible until it's done.",
      "Aim for the moon. If you miss, you may hit a star.",
      "The best way to predict the future is to create it."
    ],
    hi: [
      "महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
      "विश्वास करें कि आप कर सकते हैं और आप आधे रास्ते पहुंच गए हैं।",
      "इससे कोई फर्क नहीं पड़ता कि आप कितनी धीरे जाते हैं जब तक आप रुकते नहीं।",
      "आपका दृष्टिकोण आपकी दिशा निर्धारित करता है।",
      "सफलता अंतिम नहीं है, असफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।",
      "भविष्य उन लोगों का है जो अपने सपनों की सुंदरता में विश्वास करते हैं।",
      "आप कभी भी कोई नया लक्ष्य निर्धारित करने या नया सपना देखने के लिए बहुत बूढ़े नहीं हैं।",
      "आगे बढ़ने का रहस्य शुरुआत करना है।",
      "गुणवत्ता कोई कार्य नहीं, यह एक आदत है।",
      "हर उपलब्धि कोशिश करने के निर्णय से शुरू होती है।",
      "घड़ी मत देखो; वह जो करती है वही करो। चलते रहो।",
      "कल की हमारी प्राप्ति की एकमात्र सीमा आज के हमारे संदेह हैं।",
      "यह हमेशा असंभव लगता है जब तक यह हो नहीं जाता।",
      "चांद का निशाना लगाओ। अगर चूक गए, तो शायद किसी तारे से टकरा जाओ।",
      "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।"
    ],
    te: [
      "గొప్ప పని చేయడానికి ఏకైక మార్గం మీరు చేసే పనిని ప్రేమించడం.",
      "మీరు చేయగలరని నమ్మండి మరియు మీరు సగం దూరం చేరుకున్నారు.",
      "మీరు ఆగకుండా ఉన్నంత వరకు ఎంత నెమ్మదిగా వెళ్లినా పర్వాలేదు.",
      "మీ వైఖరి మీ దిశను నిర్ణయిస్తుంది.",
      "విజయం చివరిది కాదు, వైఫల్యం ప్రాణాంతకం కాదు: కొనసాగించే ధైర్యమే ముఖ్యం.",
      "భవిష్యత్తు వారి కలల అందంలో నమ్మకం ఉన్న వారిది.",
      "మీరు మరొక లక్ష్యం నిర్దేశించుకోవడానికి లేదా కొత్త కల కనడానికి ఎప్పుడూ చాలా వయస్సు కాదు.",
      "ముందుకు వెళ్లడంలో రహస్యం ప్రారంభించడం.",
      "నాణ్యత ఒక చర్య కాదు, అది ఒక అలవాటు.",
      "ప్రతి విజయం ప్రయత్నించాలని నిర్ణయించడంతో మొదలవుతుంది.",
      "గడియారాన్ని చూడకండి; అది చేసేది చేయండి. కొనసాగండి.",
      "రేపటి మన సాధనకు ఏకైక పరిమితి నేటి మన సందేహాలు.",
      "అది జరిగే వరకు ఎల్లప్పుడూ అసాధ్యంగా అనిపిస్తుంది.",
      "చంద్రుడిని లక్ష్యంగా పెట్టుకోండి. తప్పితే, మీరు ఒక నక్షత్రాన్ని తాకవచ్చు.",
      "భవిష్యత్తును అంచనా వేయడానికి ఉత్తమ మార్గం దానిని సృష్టించడం."
    ],
    es: [
      "La única forma de hacer un gran trabajo es amar lo que haces.",
      "Cree que puedes y ya estás a mitad de camino.",
      "No importa qué tan lento vayas mientras no te detengas.",
      "Tu actitud determina tu dirección.",
      "El éxito no es definitivo, el fracaso no es fatal: es el coraje de continuar lo que cuenta.",
      "El futuro pertenece a aquellos que creen en la belleza de sus sueños.",
      "Nunca eres demasiado viejo para establecer otra meta o soñar un nuevo sueño.",
      "El secreto para salir adelante es comenzar.",
      "La calidad no es un acto, es un hábito.",
      "Cada logro comienza con la decisión de intentar.",
      "No mires el reloj; haz lo que hace. Sigue adelante.",
      "El único límite para nuestra realización del mañana son nuestras dudas de hoy.",
      "Siempre parece imposible hasta que se hace.",
      "Apunta a la luna. Si fallas, puedes golpear una estrella.",
      "La mejor manera de predecir el futuro es crearlo."
    ],
    fr: [
      "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
      "Croyez que vous pouvez et vous êtes à mi-chemin.",
      "Peu importe la lenteur avec laquelle vous allez tant que vous ne vous arrêtez pas.",
      "Votre attitude détermine votre direction.",
      "Le succès n'est pas définitif, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
      "L'avenir appartient à ceux qui croient en la beauté de leurs rêves.",
      "Vous n'êtes jamais trop vieux pour vous fixer un autre objectif ou rêver d'un nouveau rêve.",
      "Le secret pour aller de l'avant est de commencer.",
      "La qualité n'est pas un acte, c'est une habitude.",
      "Chaque accomplissement commence par la décision d'essayer.",
      "Ne regardez pas l'horloge ; faites ce qu'elle fait. Continuez.",
      "La seule limite à notre réalisation de demain sont nos doutes d'aujourd'hui.",
      "Cela semble toujours impossible jusqu'à ce que ce soit fait.",
      "Visez la lune. Si vous ratez, vous pourriez toucher une étoile.",
      "La meilleure façon de prédire l'avenir est de le créer."
    ],
    de: [
      "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was du tust.",
      "Glaube, dass du es kannst, und du bist schon zur Hälfte da.",
      "Es spielt keine Rolle, wie langsam du gehst, solange du nicht aufhörst.",
      "Deine Einstellung bestimmt deine Richtung.",
      "Erfolg ist nicht endgültig, Misserfolg ist nicht tödlich: Es ist der Mut weiterzumachen, der zählt.",
      "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.",
      "Du bist nie zu alt, um dir ein neues Ziel zu setzen oder einen neuen Traum zu träumen.",
      "Das Geheimnis des Vorankommens ist der Anfang.",
      "Qualität ist keine Handlung, sie ist eine Gewohnheit.",
      "Jede Leistung beginnt mit der Entscheidung zu versuchen.",
      "Schau nicht auf die Uhr; tu was sie tut. Mach weiter.",
      "Die einzige Grenze für unsere Verwirklichung von morgen sind unsere Zweifel von heute.",
      "Es scheint immer unmöglich, bis es getan ist.",
      "Ziele auf den Mond. Wenn du verfehlst, triffst du vielleicht einen Stern.",
      "Der beste Weg, die Zukunft vorherzusagen, ist sie zu erschaffen."
    ],
    it: [
      "L'unico modo per fare un ottimo lavoro è amare quello che fai.",
      "Credi di poterlo fare e sei già a metà strada.",
      "Non importa quanto lentamente vai finché non ti fermi.",
      "Il tuo atteggiamento determina la tua direzione.",
      "Il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta.",
      "Il futuro appartiene a coloro che credono nella bellezza dei loro sogni.",
      "Non sei mai troppo vecchio per fissare un altro obiettivo o sognare un nuovo sogno.",
      "Il segreto per andare avanti è iniziare.",
      "La qualità non è un atto, è un'abitudine.",
      "Ogni risultato inizia con la decisione di provare.",
      "Non guardare l'orologio; fai quello che fa. Continua.",
      "L'unico limite alla nostra realizzazione di domani sono i nostri dubbi di oggi.",
      "Sembra sempre impossibile finché non viene fatto.",
      "Punta alla luna. Se manchi, potresti colpire una stella.",
      "Il modo migliore per predire il futuro è crearlo."
    ]
  };

  // Function to get a quote based on the current date and language
  const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Get quotes for current language, fallback to English if language not available
    const currentLanguageQuotes = motivationalQuotes[currentLanguage as keyof typeof motivationalQuotes] || motivationalQuotes['en'];
    
    return currentLanguageQuotes[dayOfYear % currentLanguageQuotes.length];
  };

  // Get today's quote (will update when language changes)
  const todaysQuote = getQuoteOfTheDay();

  // Function to request location permission and get current location
  const requestLocationPermission = async () => {
    try {
      console.log('Checking location services...');
      
      // First check if location services are enabled
      const locationServicesEnabled = await Location.hasServicesEnabledAsync();
      console.log('Location services enabled:', locationServicesEnabled);
      
      if (!locationServicesEnabled) {
        console.log('Location services are disabled');
        setLocationPermission('services_disabled');
        setWeatherError('Please enable location services in your device settings');
        setWeatherLoading(false);
        return null;
      }

      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      setLocationPermission(status);
      
      if (status === 'denied') {
        console.log('Location permission denied');
        setWeatherError('Location permission denied. Please enable location access in app settings.');
        setWeatherLoading(false);
        return null;
      } else if (status !== 'granted') {
        console.log('Location permission not granted:', status);
        setWeatherError('Location access is required for weather information');
        setWeatherLoading(false);
        return null;
      }

      console.log('Getting current position...');
      
      // Try with balanced accuracy first (faster and more reliable)
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000, // 10 seconds timeout
          maximumAge: 30000, // Accept cached location up to 30 seconds old
        });
        console.log('Current location obtained with balanced accuracy:', currentLocation.coords);
        setLocation(currentLocation);
        return currentLocation;
      } catch (balancedError) {
        console.log('Balanced accuracy failed, trying low accuracy:', balancedError);
        
        // Fallback to low accuracy if balanced fails
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
            timeout: 8000, // 8 seconds timeout
            maximumAge: 60000, // Accept cached location up to 1 minute old
          });
          console.log('Current location obtained with low accuracy:', currentLocation.coords);
          setLocation(currentLocation);
          return currentLocation;
        } catch (lowAccuracyError) {
          console.log('Low accuracy also failed, trying last known position:', lowAccuracyError);
          
          // Last resort: try to get last known position
          try {
            const lastKnownPosition = await Location.getLastKnownPositionAsync({
              maxAge: 300000, // Accept position up to 5 minutes old
            });
            if (lastKnownPosition) {
              console.log('Using last known position:', lastKnownPosition.coords);
              setLocation(lastKnownPosition);
              return lastKnownPosition;
            } else {
              throw new Error('No last known position available');
            }
          } catch (lastKnownError) {
            throw new Error('Unable to get location. Please check your GPS settings.');
          }
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Provide more specific error messages
      const errorMessage = error.message || '';
      if (errorMessage.includes('services')) {
        setWeatherError('Location services are disabled. Please enable GPS/Location Services.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        setWeatherError('Location request timed out. Please ensure you have good GPS signal.');
      } else if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        setWeatherError('Location permission required. Please check app permissions.');
      } else {
        setWeatherError('Unable to get location. Please check your location settings.');
      }
      
      setWeatherLoading(false);
      return null;
    }
  };

  // Function to fetch weather data from a free weather service
  const fetchFreeWeatherData = async (latitude: number, longitude: number) => {
    try {
      console.log('Trying free weather service...');
      // Using wttr.in - a free weather service
      const url = `https://wttr.in/${latitude},${longitude}?format=j1`;
      console.log('Fetching from wttr.in:', url);
      
      const response = await fetch(url);
      console.log('Free weather response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Free weather service failed');
      }
      
      const data = await response.json();
      console.log('Free weather data:', data);
      
      const current = data.current_condition?.[0];
      const location = data.nearest_area?.[0];
      const times=data.weather?.[0]
      
      if (current) {
        const transformedData = {
          location: location?.areaName?.[0]?.value || location?.region?.[0]?.value || 'Unknown Location',
          temperature: parseInt(current.temp_C) || 25,
          condition: current.weatherDesc?.[0]?.value || 'Clear',
          icon: mapFreeWeatherIconToLocal(current.weatherCode || '113'),
          humidity: parseInt(current.humidity) || 60,
          windSpeed: Math.round(parseFloat(current.windspeedKmph) || 10),
          feelsLike: parseInt(current.FeelsLikeC) || parseInt(current.temp_C) || 25,
          pressure: parseInt(current.pressure) || 1013,
          visibility: parseInt(current.visibility) || 10,
          sunrise: times.astronomy?.[0].sunrise || "6:15 AM", // wttr.in doesn't provide sunrise/sunset in this format
          sunset:times.astronomy?.[0].sunset || "6:45 pM",
          hourlyForecast: generateHourlyForecast(parseInt(current.temp_C) || 25, current.weatherCode || '113')
        };
        
        setWeatherData(transformedData);
        setWeatherError(null);
        setWeatherLoading(false);
        
        // Trigger animations when data loads successfully
        startWeatherAnimations();
        return;
      }
      
      throw new Error('Invalid weather data received');
      
    } catch (error) {
      console.error('Free weather service failed:', error);
      // If free service also fails, show service unavailable
      handleWeatherServiceUnavailable('All weather services failed');
    }
  };

  // Helper function to generate hourly forecast
  const generateHourlyForecast = (baseTemp: number, weatherCode: string) => {
    const currentHour = new Date().getHours();
    const forecast = [];
    
    for (let i = 0; i < 5; i++) {
      const hour = (currentHour + i) % 24;
      const tempVariation = Math.floor(Math.random() * 4) - 2; // ±2 degrees
      forecast.push({
        time: i === 0 ? "Now" : `${hour.toString().padStart(2, '0')}:00`,
        temp: baseTemp + tempVariation,
        icon: mapFreeWeatherIconToLocal(weatherCode)
      });
    }
    
    return forecast;
  };

  // Function to handle weather service unavailable
  const handleWeatherServiceUnavailable = (errorMessage: string) => {
    console.log('Weather service unavailable:', errorMessage);
    setWeatherError('Weather service unavailable');
    setWeatherData(null);
    setWeatherLoading(false);
  };

  // Function to map wttr.in weather codes to local icons
  const mapFreeWeatherIconToLocal = (weatherCode: string) => {
    const code = weatherCode || '113';
    
    // wttr.in weather codes
    if (['113'].includes(code)) return 'sunny'; // Clear/Sunny
    if (['116', '119', '122'].includes(code)) return 'partly-cloudy'; // Partly cloudy
    if (['143', '248', '260'].includes(code)) return 'foggy'; // Fog/Mist
    if (['125', '128', '134'].includes(code)) return 'cloudy'; // Cloudy/Overcast
    // Snow / sleet / ice pellet / hail related
    if (['179', '182', '185', '320', '323', '326', '329', '332', '335', '338', '350', '362', '365', '368', '371', '374', '377', '392', '395'].includes(code)) return 'snowy';
    // Thunderstorms - use "stormy" instead of "thunder" to match our notification messages
    if (['386', '389'].includes(code)) return 'stormy';
    // Rain / drizzle / showers related
    if (['176', '263', '266', '281', '284', '293', '296', '299', '302', '305', '308', '311', '314', '317', '353', '356', '359'].includes(code)) return 'rainy';
    
    return 'cloudy'; // Default
  };

  // Function to fetch weather data and forecast from Indian Weather API
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      // Temporarily disable primary API and use free service directly
      console.log('Using free weather service for reliable weather data...');
      await fetchFreeWeatherData(latitude, longitude);
      return;
      
      /* Commented out until API key issue is resolved
      const apiKey = Constants.expoConfig?.extra?.indianWeatherApiKey;
      console.log('Indian Weather API Key available:', !!apiKey);
      console.log('API Key value:', apiKey ? `${apiKey.substring(0, 8)}...` : 'null');
      
      // More comprehensive API key validation
      if (!apiKey || 
          apiKey === 'YOUR_INDIAN_WEATHER_API_KEY_HERE' ||
          apiKey.trim() === '' ||
          apiKey === 'undefined' ||
          apiKey === 'null' ||
          apiKey.length < 10) {
        console.log('Indian Weather API key not configured or invalid, using free weather service...');
        await fetchFreeWeatherData(latitude, longitude);
        return;
      }
      */

      // Fetch both current weather and forecast
      const currentUrl = `https://weather.indianapi.in/global/current?lat=${latitude}&lon=${longitude}`;
      const forecastUrl = `https://weather.indianapi.in/global/forecast?lat=${latitude}&lon=${longitude}`;
      
      console.log('Fetching current weather from:', currentUrl);
      console.log('Fetching forecast from:', forecastUrl);
      
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      // Fetch current weather and forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl, { method: 'GET', headers }),
        fetch(forecastUrl, { method: 'GET', headers })
      ]);
      
      console.log('Current weather response status:', currentResponse.status);
      console.log('Forecast response status:', forecastResponse.status);
      
      // Check if response is JSON before parsing
      let currentData = null;
      try {
        const currentText = await currentResponse.text();
        console.log('Raw current response:', currentText.substring(0, 200)); // Log first 200 chars
        
        if (!currentResponse.ok) {
          throw new Error(`HTTP ${currentResponse.status}: ${currentText}`);
        }
        
        // Check if response starts with valid JSON characters
        const trimmedText = currentText.trim();
        if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
          throw new Error('Response is not valid JSON format');
        }
        
        currentData = JSON.parse(currentText);
        console.log('Current weather data:', currentData);
      } catch (parseError) {
        console.error('Failed to parse current weather response:', parseError);
        throw new Error('Invalid response format from weather API');
      }
      
      let forecastData = null;
      if (forecastResponse.ok) {
        try {
          const forecastText = await forecastResponse.text();
          const trimmedForecastText = forecastText.trim();
          if (trimmedForecastText.startsWith('{') || trimmedForecastText.startsWith('[')) {
            forecastData = JSON.parse(forecastText);
            console.log('Forecast data:', forecastData);
          } else {
            console.log('Forecast response is not valid JSON, skipping');
          }
        } catch (forecastParseError) {
          console.error('Failed to parse forecast response:', forecastParseError);
          console.log('Continuing without forecast data');
        }
      } else {
        console.log('Forecast fetch failed, using current data only');
      }

      // Transform current weather data
      const current = currentData.current || currentData;
      const location = currentData.location || {};
      
      // Generate hourly forecast from forecast data or create mock data
      let hourlyForecast = [];
      if (forecastData && forecastData.forecast) {
        // Use actual forecast data
        const todayForecast = forecastData.forecast.forecastday?.[0]?.hour || [];
        const currentHour = new Date().getHours();
        
        // Get next 5 hours of forecast
        for (let i = 0; i < 5; i++) {
          const hourIndex = (currentHour + i) % 24;
          const hourData = todayForecast[hourIndex];
          
          if (hourData) {
            hourlyForecast.push({
              time: i === 0 ? "Now" : `${hourIndex}:00`,
              temp: Math.round(hourData.temp_c || hourData.temperature || current.temperature || 25),
              icon: mapIndianWeatherIconToLocal(hourData.condition?.text || hourData.weather_condition || current.weather_condition || 'clear')
            });
          }
        }
      }
      
      // If no forecast data, create simple hourly progression
      if (hourlyForecast.length === 0) {
        const baseTemp = Math.round(current.temperature || current.temp_c || 25);
        const currentHour = new Date().getHours();
        
        for (let i = 0; i < 5; i++) {
          const hour = (currentHour + i) % 24;
          const tempVariation = Math.floor(Math.random() * 4) - 2; // ±2 degrees
          hourlyForecast.push({
            time: i === 0 ? "Now" : `${hour}:00`,
            temp: baseTemp + tempVariation,
            icon: mapIndianWeatherIconToLocal(current.weather_condition || current.condition?.text || 'clear')
          });
        }
      }

      const transformedData = {
        location: location.name || location.city || currentData.name || 'Current Location',
        temperature: Math.round(current.temperature || current.temp_c || 25),
        condition: current.description || current.condition?.text || current.weather_condition || 'Clear',
        icon: mapIndianWeatherIconToLocal(current.weather_condition || current.condition?.text || 'clear'),
        humidity: current.humidity || 60,
        windSpeed: Math.round(current.wind_speed || current.wind_kph || 10),
        feelsLike: Math.round(current.feels_like || current.feelslike_c || current.temperature || current.temp_c || 25),
        pressure: current.pressure || current.pressure_mb || 1013,
        visibility: current.visibility || current.vis_km || 10,
        sunrise: current.sunrise || "6:15 AM",
        sunset: current.sunset || "6:45 PM",
        hourlyForecast: hourlyForecast
      };

      setWeatherData(transformedData);
      setWeatherError(null);
      
      // Trigger animations when data loads successfully
      startWeatherAnimations();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Check for specific API key errors
      const errorMessage = error.message || '';
      if (errorMessage.includes('Missing API key') || 
          errorMessage.includes('Invalid API key') || 
          errorMessage.includes('401') || 
          errorMessage.includes('403')) {
        console.log('API key issue detected, using free weather service...');
      } else {
        console.log('Falling back to free weather service...');
      }
      
      await fetchFreeWeatherData(latitude, longitude);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Function to map Indian Weather API conditions to local icon types
  const mapIndianWeatherIconToLocal = (weatherCondition: string) => {
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
      return 'cloudy'; // Default fallback
    }
  };



  // useEffect to initialize location and weather data
  useEffect(() => {
    const initializeWeather = async () => {
      console.log('Initializing weather...');
      
      // Start pulse animation for loading state
      startPulseAnimation();
      
      // Get user's accurate location
      const currentLocation = await requestLocationPermission();
      console.log('Location result:', currentLocation);
      
      if (currentLocation) {
        console.log('Fetching weather for accurate coordinates:', currentLocation.coords.latitude, currentLocation.coords.longitude);
        await fetchWeatherData(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      } else {
        console.log('Location access failed, trying default location fallback');
        
        // Fallback: Try to get weather for a default location (New Delhi, India)
        // This provides some weather info even when location is denied
        try {
          const defaultLat = 28.6139; // New Delhi latitude
          const defaultLon = 77.2090; // New Delhi longitude
          console.log('Using default location (New Delhi) for weather data');
          
          await fetchFreeWeatherData(defaultLat, defaultLon);
          
          // Update error message to inform user about fallback
          setWeatherError('Using default location. Enable location access for local weather.');
        } catch (fallbackError) {
          console.error('Fallback weather also failed:', fallbackError);
          setWeatherError('Weather service temporarily unavailable');
          setWeatherLoading(false);
        }
      }
    };

    initializeWeather();
  }, []);

  // Start weather animations when weather data is available
  useEffect(() => {
    if (weatherData?.icon) {
      startWeatherAnimations();
    }
  }, [weatherData]);



  // Enhanced animated weather icon function
  const getWeatherIcon = (iconType: string, size = 24, color = "#4A90E2", animated = false) => {
    const iconStyle = { width: size, height: size };
    
    if (!animated) {
      // Return static icons for non-main weather display
      switch (iconType) {
        case "sunny":
          return <Sun size={size} color={color} />;
        case "partly-cloudy":
          return <Cloud size={size} color={color} />;
        case "cloudy":
          return <Cloud size={size} color={color} />;
        case "rainy":
          return <CloudRain size={size} color={color} />;
        case "snowy":
          return <CloudSnow size={size} color={color} />;
        case "stormy":
        case "thunder":
          return <CloudLightning size={size} color={color} />;
        case "foggy":
          return <CloudOff size={size} color={color} />;
        default:
          return <Cloud size={size} color={color} />;
      }
    }

    // Return animated icons for main weather display
    switch (iconType) {
      case "sunny":
        return (
          <Animated.View
            style={[
              iconStyle,
              {
                transform: [
                  {
                    rotate: sunRotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Sun size={size} color={color} />
          </Animated.View>
        );
        
      case "partly-cloudy":
      case "cloudy":
        return (
          <Animated.View
            style={[
              iconStyle,
              {
                transform: [
                  {
                    translateX: cloudFloatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 8],
                    }),
                  },
                ],
              },
            ]}
          >
            <Cloud size={size} color={color} />
          </Animated.View>
        );
        
      case "rainy":
        return (
          <Animated.View
            style={[
              iconStyle,
              {
                transform: [
                  {
                    translateY: rainDropAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 6],
                    }),
                  },
                ],
              },
            ]}
          >
            <CloudRain size={size} color={color} />
          </Animated.View>
        );
        
      case "snowy":
        return (
          <Animated.View
            style={[
              iconStyle,
              {
                transform: [
                  {
                    translateY: snowFallAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 4],
                    }),
                  },
                ],
              },
            ]}
          >
            <CloudSnow size={size} color={color} />
          </Animated.View>
        );
        
      case "stormy":
      case "thunder":
        return (
          <Animated.View
            style={[
              iconStyle,
              {
                opacity: starFlickerAnim,
              },
            ]}
          >
            <CloudLightning size={size} color={color} />
          </Animated.View>
        );
        
      case "foggy":
        return (
          <Animated.View style={iconStyle}>
            <CloudOff size={size} color={color} />
          </Animated.View>
        );
        
      default:
        return (
          <Animated.View style={iconStyle}>
            <Cloud size={size} color={color} />
          </Animated.View>
        );
    }
  };

  // Function to get weather wallpaper gradients
  const getWeatherWallpaper = (weatherIcon?: string) => {
    switch (weatherIcon) {
      case "sunny":
        return {
          colors: ['#FFD700', '#FFA500', '#FF6347'], // Gold to orange to tomato
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
      case "partly-cloudy":
        return {
          colors: ['#87CEEB', '#4169E1', '#1E90FF'], // Sky blue to royal blue
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.6, 1]
        };
      case "cloudy":
        return {
          colors: ['#B0C4DE', '#778899', '#696969'], // Light steel blue to dim gray
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
      case "rainy":
        return {
          colors: ['#4682B4', '#2F4F4F', '#191970'], // Steel blue to dark slate gray to midnight blue
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.4, 1]
        };
      case "stormy":
      case "thunder":
        return {
          colors: ['#2C3E50', '#3B3B98', '#1B1464'], // Dark stormy blues/purples
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
      case "snowy":
        return {
          colors: ['#E0F2FF', '#B3E5FC', '#90CAF9'], // Icy blue tones
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
      case "foggy":
        return {
          colors: ['#BDC3C7', '#95A5A6', '#7F8C8D'], // Misty gray tones
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
      default:
        return {
          colors: ['#4A90E2', '#357ABD', '#2E5BBA'], // Default blue gradient
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          locations: [0, 0.5, 1]
        };
    }
  };

  // Weather pattern overlay component
  const WeatherPatternOverlay = ({ weatherType }: { weatherType?: string }) => {
    const patternOpacity = 0.1;
    
    switch (weatherType) {
      case "sunny":
        // Sun rays pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <Defs>
              <RadialGradient id="sunPattern" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                <Stop offset="70%" stopColor="#FFA500" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#FF6347" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="50" fill="url(#sunPattern)" />
            {/* Sun rays */}
            {[...Array(12)].map((_, i) => (
              <Path
                key={i}
                d={`M50,50 L${50 + 40 * Math.cos(i * 30 * Math.PI / 180)},${50 + 40 * Math.sin(i * 30 * Math.PI / 180)}`}
                stroke="#FFD700"
                strokeWidth="0.5"
                strokeOpacity={patternOpacity}
              />
            ))}
          </Svg>
        );
      case "rainy":
        // Rain drops pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="none slice"
          >
            {[...Array(20)].map((_, i) => (
              <Path
                key={i}
                d={`M${10 + (i % 10) * 10},${5 + Math.floor(i / 10) * 45} L${12 + (i % 10) * 10},${15 + Math.floor(i / 10) * 45}`}
                stroke="#B0E0E6"
                strokeWidth="0.5"
                strokeOpacity={patternOpacity}
              />
            ))}
          </Svg>
        );
      case "cloudy":
        // Cloud pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="none slice"
          >
            <Defs>
              <RadialGradient id="cloudPattern" cx="30%" cy="30%" r="40%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#D3D3D3" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="30" cy="30" rx="25" ry="15" fill="url(#cloudPattern)" />
            <Ellipse cx="70" cy="20" rx="20" ry="12" fill="url(#cloudPattern)" />
            <Ellipse cx="50" cy="70" rx="30" ry="18" fill="url(#cloudPattern)" />
          </Svg>
        );
      case "stormy":
      case "thunder":
        // Lightning pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="none slice"
          >
            {[...Array(3)].map((_, i) => (
              <Path
                key={i}
                d={`M${15 + i * 30},10 L${25 + i * 30},35 L${20 + i * 30},35 L${35 + i * 30},65 L${25 + i * 30},65 L${40 + i * 30},90`}
                stroke="#FFD700"
                strokeWidth="1.2"
                strokeOpacity={0.25}
                fill="none"
              />
            ))}
            <Rect x="0" y="0" width="100" height="100" fill="#FFFFFF" opacity={0.04} />
          </Svg>
        );
      case "snowy":
        // Snowflakes pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="none slice"
          >
            {[...Array(30)].map((_, i) => (
              <Circle
                key={i}
                cx={(i % 10) * 10 + 5}
                cy={Math.floor(i / 10) * 30 + 10}
                r="1.5"
                fill="#FFFFFF"
                opacity={patternOpacity + 0.05}
              />
            ))}
          </Svg>
        );
      case "foggy":
        // Fog/mist pattern
        return (
          <Svg
            style={StyleSheet.absoluteFillObject}
            viewBox="0 0 100 100"
            preserveAspectRatio="none slice"
          >
            <Defs>
              <RadialGradient id="fogPattern1" cx="25%" cy="25%" r="35%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
                <Stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.05" />
              </RadialGradient>
              <RadialGradient id="fogPattern2" cx="75%" cy="50%" r="40%">
                <Stop offset="0%" stopColor="#F3F4F6" stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.03" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="25" cy="25" rx="35" ry="20" fill="url(#fogPattern1)" />
            <Ellipse cx="75" cy="50" rx="40" ry="25" fill="url(#fogPattern2)" />
            <Ellipse cx="50" cy="75" rx="30" ry="18" fill="url(#fogPattern1)" />
            <Rect x="0" y="0" width="100" height="100" fill="#FFFFFF" opacity={0.02} />
          </Svg>
        );
      default:
        return null;
    }
  };



  // Resident alerts data - sorted by time (newest first)
  const residentAlertsData = [
    { 
      id: 1,
      title: t('alerts.waterShutdown'), 
      message: t('alerts.waterShutdownMsg'), 
      priority: 'high', 
      time: t('alerts.hoursAgo', { count: 2 }),
      timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
      read: false
    },
    {
      id: 4,
      title: 'Elevator Maintenance',
      message: 'Elevator in Block A will be under maintenance from 10 AM to 2 PM tomorrow.',
      priority: 'medium',
      time: '5 hours ago',
      timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
      read: false
    },
    { 
      id: 2,
      title: t('alerts.newSecurityProtocol'), 
      message: t('alerts.newSecurityProtocolMsg'), 
      priority: 'medium', 
      time: t('alerts.dayAgo', { count: 1 }),
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false
    },
    {
      id: 5,
      title: 'Parking Violation Notice',
      message: 'Vehicle parked in visitor slot without proper authorization. Please move immediately.',
      priority: 'high',
      time: '1 day ago',
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    },
    {
      id: 6,
      title: 'Community Event Reminder',
      message: 'Annual sports day is scheduled for this weekend. Registration is still open.',
      priority: 'low',
      time: '2 days ago',
      timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true
    },
    { 
      id: 3,
      title: t('alerts.communityMeeting'), 
      message: t('alerts.communityMeetingMsg'), 
      priority: 'low', 
      time: t('alerts.daysAgo', { count: 3 }),
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 7,
      title: 'Power Outage Alert',
      message: 'Scheduled power maintenance on Sunday from 6 AM to 8 AM. Please plan accordingly.',
      priority: 'medium',
      time: '3 days ago',
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 8,
      title: 'New Resident Welcome',
      message: 'Please welcome the new family moving into Flat 304. Community orientation scheduled.',
      priority: 'low',
      time: '1 week ago',
      timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true
    }
  ];

  // Sort alerts by timestamp (newest first)
  const residentAlerts = residentAlertsData.sort((a, b) => b.timestamp - a.timestamp);

  // Calculate unread notifications count
  const unreadNotificationsCount = residentAlerts.filter(alert => !alert.read).length;

  const quickActions = [
    { icon: CommunityGateIcon, label: t('quickActions.gate'), color: '#4DD0E1' },
    { icon: Store, label: t('quickActions.store'), color: '#4DD0E1' },
    { icon: ShuttleRacketIcon, label: t('quickActions.facilities'), color: '#4DD0E1' },
    { icon: CommunityMapIcon, label: t('quickActions.communityMap'), color: '#4DD0E1' },
    { icon: Heart, label: t('elderMonitoring.title'), color: '#4DD0E1' },
  ];

  // Weather particle components
  const WeatherParticles = ({ weatherType }: { weatherType: string }) => {
    switch (weatherType) {
      case 'rainy':
        return (
          <View style={styles.weatherParticlesContainer}>
            {rainAnimations.map((anim, index) => (
              <Animated.View
                key={`rain-${index}`}
                style={[
                  styles.rainDrop,
                  {
                    left: `${(index * 7) % 95}%`,
                    transform: [{ translateY: anim.translateY }],
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
          </View>
        );
        
      case 'snowy':
        return (
          <View style={styles.weatherParticlesContainer}>
            {snowAnimations.map((anim, index) => (
              <Animated.View
                key={`snow-${index}`}
                style={[
                  styles.snowFlake,
                  {
                    left: `${(index * 5) % 95}%`,
                    transform: [
                      { translateY: anim.translateY },
                      { translateX: anim.translateX },
                    ],
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
          </View>
        );
        
      case 'sunny':
        return (
          <View style={styles.weatherParticlesContainer}>
            {sunRayAnimations.map((anim, index) => (
              <Animated.View
                key={`ray-${index}`}
                style={[
                  styles.sunRay,
                  {
                    top: `${20 + (index * 8)}%`,
                    left: `${10 + (index * 10)}%`,
                    transform: [{ scale: anim.scale }],
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
          </View>
        );
        
      case 'cloudy':
      case 'partly-cloudy':
        return (
          <View style={styles.weatherParticlesContainer}>
            {cloudAnimations.map((anim, index) => (
              <Animated.View
                key={`cloud-${index}`}
                style={[
                  styles.cloudParticle,
                  {
                    top: `${15 + index * 25}%`,
                    transform: [{ translateX: anim.translateX }],
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
          </View>
        );
        
      case 'stormy':
        return (
          <View style={styles.weatherParticlesContainer}>
            {cloudAnimations.map((anim, index) => (
              <Animated.View
                key={`cloud-${index}`}
                style={[
                  styles.stormCloud,
                  {
                    top: `${15 + index * 25}%`,
                    transform: [{ translateX: anim.translateX }],
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
            {sunRayAnimations.slice(0, 4).map((anim, index) => (
              <Animated.View
                key={`lightning-${index}`}
                style={[
                  styles.lightning,
                  {
                    top: `${30 + index * 15}%`,
                    left: `${20 + index * 20}%`,
                    opacity: anim.opacity,
                  },
                ]}
              />
            ))}
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header with Profile */}
      <View style={styles.modernHeader}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Users size={20} color="#4A90E2" />
            </View>
          </View>
          <View style={styles.greetingSection}>
            <Text style={styles.modernGreeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.modernBellContainer}
          onPress={() => router.push('/(tabs)/notifications')}
        >
          <Bell size={20} color="#6B7280" />
          {unreadNotificationsCount > 0 && (
            <View style={styles.modernNotificationBadge}>
              <Text style={styles.modernNotificationBadgeText}>
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modernContent} contentContainerStyle={styles.modernScrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Weather Card with Gradients */}
        <View style={styles.enhancedWeatherCard}>
          {weatherLoading ? (
            <LinearGradient
              colors={['#E0F2FE', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.enhancedWeatherGradient}
            >
              <View style={styles.enhancedWeatherHeader}>
                <Text style={styles.enhancedWeatherTitle}>🌤️ Weather Today</Text>
                <ActivityIndicator size="small" color="#4A90E2" />
              </View>
              <View style={styles.modernWeatherLoading}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.modernLoadingText}>Loading weather...</Text>
              </View>
            </LinearGradient>
          ) : weatherError ? (
            <LinearGradient
              colors={['#F3F4F6', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.enhancedWeatherGradient}
            >
              <View style={styles.enhancedWeatherHeader}>
                <Text style={styles.enhancedWeatherTitle}>🌤️ Weather Today</Text>
              </View>
              <View style={styles.modernWeatherError}>
                <CloudOff size={32} color="#9CA3AF" />
                <Text style={styles.modernErrorTitle}>
                  {locationPermission === 'denied' 
                    ? 'Location access denied'
                    : locationPermission === 'services_disabled'
                    ? 'Location services disabled'
                    : 'Weather service unavailable'
                  }
                </Text>
                <Text style={styles.modernErrorSubtitle}>{weatherError}</Text>
                <TouchableOpacity 
                  style={styles.modernRetryButton}
                  onPress={retryLocationAndWeather}
                >
                  <Text style={styles.modernRetryButtonText}>
                    {locationPermission === 'services_disabled' ? 'Check Settings' : 'Try Again'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ) : weatherData ? (
            <LinearGradient
              colors={getWeatherGradient(weatherData.icon).colors}
              start={getWeatherGradient(weatherData.icon).start}
              end={getWeatherGradient(weatherData.icon).end}
              style={styles.enhancedWeatherGradient}
            >
              <View style={styles.enhancedWeatherHeader}>
                <Text style={[
                  styles.enhancedWeatherTitle,
                  { color: getWeatherTextColor(weatherData.icon) }
                ]}>
                  🌤️ Weather Today
                </Text>
              </View>
              
              <View style={styles.enhancedWeatherContainer}>
                {/* Weather particles background */}
                <WeatherParticles weatherType={weatherData.icon} />
                
                <Animated.View style={[styles.modernWeatherContent, { opacity: fadeAnim }]}>
                  <View style={styles.enhancedWeatherMain}>
                    <View style={styles.enhancedTempSection}>
                      <Text style={[
                        styles.enhancedTemperature,
                        { color: getWeatherTextColor(weatherData.icon) }
                      ]}>
                        {weatherData.temperature}°
                      </Text>
                    </View>
                  <View style={styles.enhancedLocationInfo}>
                    <Text style={[
                      styles.enhancedLocation,
                      { color: getWeatherTextColor(weatherData.icon) }
                    ]}>
                      {weatherData.location}
                    </Text>
                    <Text style={[
                      styles.enhancedCondition,
                      { color: getWeatherSubtextColor(weatherData.icon) }
                    ]}>
                      {weatherData.condition}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.enhancedWeatherStats,
                  { backgroundColor: getWeatherStatsBackground(weatherData.icon) }
                ]}>
                  <Text style={[
                    styles.enhancedStatsText,
                    { color: getWeatherSubtextColor(weatherData.icon) }
                  ]}>
                    Feels like {weatherData.feelsLike}° • {weatherData.humidity}% humidity
                  </Text>
                </View>
              </Animated.View>
              </View>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={['#F3F4F6', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.enhancedWeatherGradient}
            >
              <View style={styles.enhancedWeatherHeader}>
                <Text style={styles.enhancedWeatherTitle}>🌤️ Weather Today</Text>
              </View>
              <View style={styles.modernWeatherError}>
                <CloudOff size={32} color="#9CA3AF" />
                <Text style={styles.modernErrorTitle}>No weather data</Text>
                <Text style={styles.modernErrorSubtitle}>Unable to load weather information</Text>
              </View>
            </LinearGradient>
          )}
        </View>

        
        {/* Modern Quick Actions Section */}
        <View style={styles.modernQuickActionsSection}>
          <Text style={styles.modernSectionTitle}>Quick Actions</Text>
          
          <View style={styles.modernQuickActionsGrid}>
            {/* Row 1 */}
            <View style={styles.modernActionRow}>
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/gate')}>
                <View style={styles.modernActionIconContainer}>
                  <CommunityGateIcon size={24} color="#4A90E2" />
                </View>
                <Text style={styles.modernActionLabel}>Gate Entry</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/store')}>
                <View style={styles.modernActionIconContainer}>
                  <Store size={24} color="#10B981" />
                </View>
                <Text style={styles.modernActionLabel}>Store</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.modernActionRow}>
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/facilities')}>
                <View style={styles.modernActionIconContainer}>
                  <ShuttleRacketIcon size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.modernActionLabel}>Facilities Booking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/community-map')}>
                <View style={styles.modernActionIconContainer}>
                  <CommunityMapIcon size={24} color="#F59E0B" />
                </View>
                <Text style={styles.modernActionLabel}>Community Map</Text>
              </TouchableOpacity>
            </View>

            {/* Row 3 */}
            <View style={styles.modernActionRow}>
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/local-connect')}>
                <View style={styles.modernActionIconContainer}>
                  <Users size={24} color="#EF4444" />
                </View>
                <Text style={styles.modernActionLabel}>Local Connect</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('/elder-monitoring')}>
                <View style={styles.modernActionIconContainer}>
                  <Heart size={24} color="#EC4899" />
                </View>
                <Text style={styles.modernActionLabel}>Elder Monitoring</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Modern Header Styles
  modernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    marginRight: s(12),
  },
  profileImage: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  greetingSection: {
    flex: 1,
  },
  modernGreeting: {
    fontSize: fontSize.small,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: vs(2),
  },
  userName: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: '#1E293B',
  },
  modernBellContainer: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modernNotificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: s(10),
    minWidth: s(18),
    height: s(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modernNotificationBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.tiny - 1,
    fontWeight: '700',
  },

  // Modern Content Styles
  modernContent: {
    flex: 1,
  },
  modernScrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
  },

  // Modern Quote Card Styles
  modernQuoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(20),
    marginTop: vs(20),
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modernQuoteTitle: {
    fontSize: fontSize.medium,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: vs(12),
  },
  modernQuoteText: {
    fontSize: fontSize.regular,
    lineHeight: getLineHeight(fontSize.regular, 1.5),
    color: '#475569',
    fontStyle: 'italic',
    fontWeight: '500',
  },

  // Modern Weather Card Styles
  modernWeatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modernWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  modernWeatherTitle: {
    fontSize: fontSize.medium,
    fontWeight: '700',
    color: '#1E293B',
  },
  modernWeatherContent: {
    gap: vs(12),
  },
  modernWeatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modernTempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  modernTemperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1E293B',
  },
  modernWeatherIcon: {
    padding: s(8),
    backgroundColor: '#F1F5F9',
    borderRadius: s(12),
  },
  modernLocationInfo: {
    alignItems: 'flex-end',
    flex: 1,
  },
  modernLocation: {
    fontSize: fontSize.regular,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
  },
  modernCondition: {
    fontSize: fontSize.small,
    color: '#64748B',
    textAlign: 'right',
    marginTop: vs(4),
  },
  modernWeatherStats: {
    backgroundColor: '#F8FAFC',
    padding: s(12),
    borderRadius: s(12),
    marginTop: vs(8),
  },
  modernStatsText: {
    fontSize: fontSize.small,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  modernWeatherLoading: {
    alignItems: 'center',
    paddingVertical: vs(40),
    gap: vs(12),
  },
  modernLoadingText: {
    fontSize: fontSize.small,
    color: '#64748B',
    fontWeight: '500',
  },
  modernWeatherError: {
    alignItems: 'center',
    paddingVertical: vs(32),
    gap: vs(12),
  },
  modernErrorTitle: {
    fontSize: fontSize.regular,
    fontWeight: '600',
    color: '#374151',
  },
  modernErrorSubtitle: {
    fontSize: fontSize.small,
    color: '#6B7280',
    textAlign: 'center',
  },
  modernRetryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: s(20),
    paddingVertical: vs(8),
    borderRadius: s(20),
    marginTop: vs(8),
  },
  modernRetryButtonText: {
    fontSize: fontSize.small,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Modern Quick Actions Styles
  modernQuickActionsSection: {
    marginBottom: vs(20),
  },
  modernSectionTitle: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: vs(16),
  },
  modernQuickActionsGrid: {
    gap: vs(12),
  },
  modernActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(12),
  },
  modernActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minHeight: vs(90),
    justifyContent: 'center',
    gap: vs(8),
  },
  modernActionIconContainer: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  modernActionLabel: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.small, 1.3),
  },

  // Enhanced Weather Card Styles with Gradients
  enhancedWeatherCard: {
    borderRadius: s(16),
    marginTop: vs(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  enhancedWeatherGradient: {
    borderRadius: s(16),
    padding: s(20),
    minHeight: vs(120),
  },
  enhancedWeatherContainer: {
    position: 'relative',
    minHeight: vs(80),
  },
  enhancedWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  enhancedWeatherTitle: {
    fontSize: fontSize.medium,
    fontWeight: '700',
    color: '#1E293B',
  },
  enhancedWeatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(16),
  },
  enhancedTempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  enhancedTemperature: {
    fontSize: 52,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 56,
  },
  enhancedWeatherIconContainer: {
    padding: s(12),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: s(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  enhancedLocationInfo: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: s(16),
  },
  enhancedLocation: {
    fontSize: fontSize.regular,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
    marginBottom: vs(4),
  },
  enhancedCondition: {
    fontSize: fontSize.small,
    color: '#64748B',
    textAlign: 'right',
    fontWeight: '500',
  },
  enhancedWeatherStats: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    padding: s(14),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  enhancedStatsText: {
    fontSize: fontSize.small,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Weather Particles Styles
  weatherParticlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  rainDrop: {
    position: 'absolute',
    width: s(2),
    height: vs(20),
    backgroundColor: '#60A5FA',
    borderRadius: s(1),
    opacity: 0.7,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  snowFlake: {
    position: 'absolute',
    width: s(6),
    height: s(6),
    backgroundColor: '#FFFFFF',
    borderRadius: s(3),
    opacity: 0.9,
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  sunRay: {
    position: 'absolute',
    width: s(5),
    height: s(5),
    backgroundColor: '#FACC15',
    borderRadius: s(2.5),
    opacity: 0.8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  cloudParticle: {
    position: 'absolute',
    width: s(20),
    height: vs(12),
    backgroundColor: '#BAE6FD',
    borderRadius: s(10),
    opacity: 0.5,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  stormCloud: {
    position: 'absolute',
    width: s(25),
    height: vs(15),
    backgroundColor: '#475569',
    borderRadius: s(12),
    opacity: 0.7,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  lightning: {
    position: 'absolute',
    width: s(3),
    height: vs(25),
    backgroundColor: '#FDE047',
    borderRadius: s(1.5),
    opacity: 0.95,
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Legacy styles (keeping for compatibility)
  scrollContent: {
    paddingHorizontal: spacing.regular,
    paddingBottom: vs(20),
  },
  header: {
    paddingVertical: vs(10),
    paddingHorizontal: s(15),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: fontSize.regular,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: getLineHeight(fontSize.regular),
  },
  residentText: {
    fontSize: fontSize.small,
    color: '#F4D8CD',
    marginTop: vs(2),
    lineHeight: getLineHeight(fontSize.small),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },

  bellContainer: {
    padding: s(8),
    borderRadius: s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: s(2),
    right: s(2),
    backgroundColor: '#EF4444',
    borderRadius: s(10),
    minWidth: s(18),
    height: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(4),
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.tiny,
    fontWeight: 'bold',
    lineHeight: fontSize.tiny,
  },
  appName: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: s(5),
    lineHeight: getLineHeight(fontSize.large),
  },
  content: {
    flex: 1,
    padding: spacing.regular,
    backgroundColor: '#F5F9FF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: vs(40),
  },
  blankSection: {
    backgroundColor: '#FFFFFF',
    padding: spacing.medium,
    paddingTop: spacing.medium,
    paddingBottom: vs(20),
    borderRadius: 0,
    marginHorizontal: -spacing.regular,
    marginTop: vs(-10),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: vs(90),
    borderBottomLeftRadius: s(20),
    borderBottomRightRadius: s(20),
  },
  quoteTitle: {
    fontSize: fontSize.medium,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: vs(8),
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.medium),
  },
  quoteDivider: {
    height: 1,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    width: '35%',
    alignSelf: 'center',
    marginBottom: vs(10),
  },
  quoteText: {
    fontSize: fontSize.small,
    color: '#4B5563',
    lineHeight: getLineHeight(fontSize.small),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: vs(35),
    marginTop: vs(15),
  },
  sectionTitle: {
    fontSize: fontSize.xlarge,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: vs(18),
    marginLeft: s(5),
    lineHeight: getLineHeight(fontSize.xlarge),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: s(5),
    marginTop: vs(10),
  },
  actionCard: {
    width: wp(28),
    alignItems: 'center',
    marginBottom: vs(20),
    backgroundColor: '#FFFFFF',
    padding: s(12),
    paddingVertical: vs(20),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: s(12),
  },
  actionIconContainer: {
    width: s(70),
    height: s(70),
    borderRadius: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
    backgroundColor: '#F8F9FA',
  },
  actionLabel: {
    fontSize: fontSize.medium,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4B5563',
    marginTop: vs(5),
    lineHeight: getLineHeight(fontSize.medium),
    flexWrap: 'wrap',
    maxWidth: wp(25),
  },

  // Compact Weather Card Styles
  weatherCard: {
    borderRadius: s(16),
    marginBottom: vs(20),
    marginTop: vs(5),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  weatherGradient: {
    paddingHorizontal: s(16),
    paddingVertical: vs(16),
  },
  weatherContent: {
    flex: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  weatherTitle: {
    fontSize: fontSize.medium,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: s(8),
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTempSection: {
    flex: 1,
  },
  weatherTemperature: {
    fontSize: isVerySmallDevice ? fontSize.xxlarge : fontSize.huge,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: isVerySmallDevice ? fontSize.xxlarge * 1.1 : fontSize.huge * 1.1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  weatherLocation: {
    fontSize: fontSize.small,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginTop: vs(2),
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  weatherConditionSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherCondition: {
    fontSize: fontSize.medium,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: vs(4),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  weatherMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    flex: isSmallDevice ? 0 : 1,
    justifyContent: isSmallDevice ? 'flex-start' : 'center',
    minWidth: isSmallDevice ? 'auto' : wp(25),
  },
  weatherMetricValue: {
    fontSize: fontSize.tiny,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherFeelsLike: {
    fontSize: isVerySmallDevice ? RF(9) : fontSize.tiny,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: vs(4),
  },

  // Simple Weather Info Styles
  weatherInfoRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginTop: vs(12),
    marginBottom: vs(8),
  },
  weatherInfoText: {
    fontSize: fontSize.tiny,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Weather Notification Message Styles
  weatherMessageRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: s(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginTop: vs(8),
    marginBottom: vs(4),
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
  },
  weatherMessageText: {
    fontSize: fontSize.tiny,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: getLineHeight(fontSize.tiny),
  },

  // Compact Layout Styles for Very Small Devices
  weatherCompactLayout: {
    flex: 1,
    justifyContent: 'space-between',
    gap: vs(6),
  },
  weatherTempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  weatherMetricsCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: s(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    flexWrap: 'wrap',
    gap: s(4),
  },
  weatherMetricCompact: {
    fontSize: RF(8),
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'center',
    minWidth: wp(25),
  },

  // Small Device Layout Styles
  weatherMetricsRow: {
    flexDirection: 'column',
    gap: vs(4),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: s(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  weatherMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    flex: 1,
    justifyContent: 'flex-start',
  },

  // Hourly Forecast Styles
  hourlyForecastContainer: {
    marginTop: vs(16),
    paddingTop: vs(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  hourlyForecastScroll: {
    paddingHorizontal: s(4),
  },
  hourlyForecastItem: {
    alignItems: 'center',
    marginHorizontal: s(8),
    minWidth: s(50),
  },
  hourlyTime: {
    fontSize: fontSize.tiny,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: vs(6),
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  hourlyTemp: {
    fontSize: fontSize.small,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: vs(6),
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Service Unavailable Styles
  serviceUnavailableContainer: {
    alignItems: 'center',
    paddingVertical: vs(16),
  },
  serviceUnavailableTitle: {
    fontSize: fontSize.medium,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: vs(12),
    marginBottom: vs(4),
  },
  serviceUnavailableSubtitle: {
    fontSize: fontSize.small,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: vs(12),
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: s(20),
    paddingVertical: vs(8),
    borderRadius: s(20),
    marginTop: vs(8),
  },
  retryButtonText: {
    fontSize: fontSize.small,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Quick Actions Styles
  quickActionsSection: {
    marginTop: vs(25),
    marginBottom: vs(20),
  },
  sectionTitle: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: vs(16),
    textAlign: 'left',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: s(8),
    marginBottom: vs(12),
  },
  quickActionsGridThree: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: s(6),
    marginBottom: vs(12),
    marginLeft: s(-16),
    paddingRight: s(16),
  },
  quickActionsGridTwo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: s(16),
    marginLeft: s(-8),
    paddingRight: s(16),
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(12)) / 2, // 2 columns with gap
    minHeight: vs(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionCardThree: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(12)) / 3, // 3 columns with gap
    minHeight: vs(90),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionCardTwo: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(24)) / 2, // 2 columns with more gap
    minHeight: vs(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIconContainer: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(8),
  },
  actionLabel: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.small),
  },
});
import { View, Text, StyleSheet, type ViewStyle, Alert,ActivityIndicator   } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Svg, { Path, Circle, Rect, Line, Polygon } from "react-native-svg"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Location from "expo-location"
import { s, vs, ms } from 'react-native-size-matters';
import React, { useEffect, useState } from "react"
import { Platform } from "react-native"

type WeatherCardProps = {
  style?: ViewStyle
  timeLabel?: string
  dateLabel?: string
}

const fontSize = {
  small: ms(12),
  regular: ms(14),
  medium: ms(16),
  large: ms(20),
};
type ConditionKey = "sunny" | "cloudy" | "windy" | "fog" | "snow" | "rain"

const WEATHER_THEME: Record<ConditionKey, { gradient: string[], textMain: string, textSub: string, icon?: string, iconColor?: string, dunes?: [string, string, string] }> = {
  sunny: {
    gradient: ["#FFD778", "#FF9A56", "#FF7B42"],
    icon: "white-balance-sunny",
    iconColor: "rgba(255,255,255,0.95)",
    dunes: ["#F7AE3A", "#F5A22C", "#EE9720"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.92)",
  },
  cloudy: {
    gradient: ["#87CEEB", "#6BB6FF", "#4A90E2"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.90)",
  },
  windy: {
    gradient: ["#98E4D6", "#7DD3C0", "#5FBDAA"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.90)",
  },
  fog: {
    gradient: ["#B8C6DB", "#A8B8CC", "#98A8BC"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.90)",
  },
  snow: {
    gradient: ["#E6E6FA", "#D8BFD8", "#DDA0DD"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.90)",
  },
  rain: {
    gradient: ["#708090", "#556B7D", "#3A4A5C"],
    textMain: "#FFFFFF",
    textSub: "rgba(255,255,255,0.90)",
  },
}


const norm = (s: string) => s.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim()
function mapToConditionKey(apiCondition: string): ConditionKey {
  const condition = norm(apiCondition)

  if (["clear"].includes(condition)) return "sunny"
  if ([ "overcast", "mist", "haze","clouds" ].includes(condition)) return "cloudy"
  if (["rain", "drizzle", "thunderstorm"].includes(condition)) return "rain"
  if (["snow", "sleet"].includes(condition)) return "snow"
  if (["fog", "smoke"].includes(condition)) return "fog"
  if (["wind", "windy"].includes(condition)) return "windy"

  return "cloudy" // fallback
}


export default function WeatherCard({ style }: WeatherCardProps) {
  const [timeLabel, setTimeLabel] = useState("")
  const [dateLabel, setDateLabel] = useState("")
  const [district, setDistrict] = useState("")
const [state, setState] = useState("")
  // 🕒 Get current time and date
  useEffect(() => {
    const now = new Date()

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short", // e.g., Mon
      month: "short",   // e.g., Sep
      day: "numeric",   // e.g., 9
    }

    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const date = now.toLocaleDateString("en-US", options) // e.g., "Mon, Sep 9"

    setTimeLabel(time)
    setDateLabel(date)
  }, [])

  // 🌦️ Weather fetching logic...
const [temperature, setTemperature] = useState<number | null>(null)
const [condition, setCondition] = useState<string>("")
const [errorMsg, setErrorMsg] = useState<string>("")
const [cityName, setCityName] = useState<string>("")
const [shortAddress, setShortAddress] = useState<string>("")
const [weatherLoading, setWeatherLoading] = useState(true)
const [weatherError, setWeatherError] = useState<string | null>(null)
const [locationPermission, setLocationPermission] = useState<string | null>(null)
useEffect(() => {
  const fetchWeather = async () => {
    try {
      setWeatherLoading(true)
      setWeatherError(null)

      // 📍 Ask for location permission
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setLocationPermission("denied")
        setWeatherError("Location permission denied")
        setWeatherLoading(false)
        return
      }

      setLocationPermission("granted")

      // 📍 Get location
      let location = await Location.getCurrentPositionAsync({})
      const lat = location.coords.latitude
      const lon = location.coords.longitude
      console.log("Fetched coordinates:", lat, lon)

      // 🌦️ Weather API
      const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

      const res = await fetch(url)
      const data = await res.json()

      if (data.cod !== 200) {
        throw new Error(data.message || "Failed to fetch weather")
      }

      setTemperature(Math.round(data.main.temp))
      setCondition(data.weather[0].main || "Sunny")
      console.log("Weather data:", data)

      // 📍 Reverse Geocode
      await place(lat, lon)
    } catch (err: any) {
      console.error("Weather fetch error:", err)
      setWeatherError(err.message || "Failed to fetch weather data.")
    } finally {
      setWeatherLoading(false)
    }
  }

  fetchWeather()
}, [])

// 🔄 Retry handler
const retryLocationAndWeather = () => {
  setWeatherLoading(true)
  setWeatherError(null)
  setTemperature(null)
  setCondition("")
  // re-run effect
  ;(async () => {
    let { status } = await Location.getForegroundPermissionsAsync()
    if (status !== "granted") {
      setLocationPermission("denied")
      setWeatherError("Location permission denied")
      setWeatherLoading(false)
      return
    }
    setLocationPermission("granted")
    const location = await Location.getCurrentPositionAsync({})
    await place(location.coords.latitude, location.coords.longitude)
  })()
}

  // 🔹 Reverse geocoding function
  const place = async (lat: number, long: number) => {
    console.log("Reverse geocoding coordinates:", lat, long)
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.70d968973f3064d32f38316a30d32eb1&lat=${lat}&lon=${long}&format=json`
      )
      const data = await response.json()
      console.log("Geolocation response:", data)

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || "Unknown"

        // Take first two parts of display_name
        const displayName = data.display_name || ""
        const parts = displayName.split(",").map(p => p.trim())
        const shortAddr = parts.slice(0, 2).join(", ") || "Unknown"
console.log("Extracted city:", city, "Short address:", shortAddr) 
        setCityName(city)
        setShortAddress(shortAddr)

        return { city, shortAddr }
      } else if (data.error) {
        console.error("Geocoding error:", data.error)
        Alert.alert("Warning", "Could not determine location details.")
      }
    } catch (error) {
      console.error("Error getting location info:", error)
      Alert.alert("Warning", "Could not determine location details.")
    }
  }




  if (errorMsg) {
    return (
      <View style={[styles.card, style]}>
        <Text style={{ padding: 20, textAlign: "center" }}>{errorMsg}</Text>
      </View>
    )
  }


const key: ConditionKey = mapToConditionKey(condition)


  const theme = WEATHER_THEME[key]

  return (
  <View style={[styles.card, style]}>
  {weatherLoading ? (
    // 🌤️ Loading State
    <LinearGradient
      colors={['#E0F2FE', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.top}
    >
      <View style={styles.enhancedWeatherHeader}>
        <Text style={styles.enhancedWeatherTitle}>🌤️ Weather Today</Text>
        {/* Removed ActivityIndicator here */}
      </View>
      <View style={styles.modernWeatherLoading}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.modernLoadingText}>Loading weather...</Text>
      </View>
    </LinearGradient>
  ) : weatherError ? (
    // ⚠️ Error State
    <LinearGradient
      colors={['#F3F4F6', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.top}
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
            : 'Weather service unavailable'}
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
  ) : (
    // ✅ Success State (your original card)
    <>
      <LinearGradient 
        colors={theme.gradient} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.top}
      >
        <View style={styles.contentContainer}>
          {key === "sunny" && theme.icon && (
           <MaterialCommunityIcons name="cloud-off-outline" size={32} color="#9CA3AF" />
          )}

          <View style={styles.textBlock}>
            <Text style={[styles.temperature, { color: theme.textMain }]}>
              {temperature}°
            </Text>
            <Text style={[styles.condition, { color: theme.textSub }]}>
              {condition}
            </Text>
          </View>
        </View>

        <View style={styles.sceneContainer}>
          {key === "sunny" && theme.dunes && <SunnyDunes colors={theme.dunes} />}
          {key === "cloudy" && <CloudyScene />}
          {key === "windy" && <WindyScene />}
          {key === "fog" && <FogScene />}
          {key === "snow" && <SnowScene />}
          {key === "rain" && <RainScene />}
        </View>
      </LinearGradient>

      <View style={styles.headerRow}>
        <View style={styles.leftBlock}>
          <Text style={styles.shortAddress}>{shortAddress}</Text>
          <Text style={styles.city}>{cityName}</Text>
        </View>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
    </>
  )}
</View>

)

}

/** SUNNY scene: orange dunes */
function SunnyDunes({ colors }: { colors: [string, string, string] }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      <Path d="M0,90 C60,70 110,100 160,88 C210,76 255,90 300,80 L300,120 L0,120 Z" fill={colors[0]} opacity={0.3} />
      <Path d="M0,98 C70,82 130,108 180,98 C230,88 265,98 300,94 L300,120 L0,120 Z" fill={colors[1]} opacity={0.35} />
      <Path
        d="M0,106 C65,98 140,115 210,106 C260,100 285,104 300,104 L300,120 L0,120 Z"
        fill={colors[2]}
        opacity={0.28}
      />
    </Svg>
  )
}

/** CLOUDY scene: moon, misty hills, slim trees (matches screenshot style) */
function CloudyScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      {/* moon */}
      <Circle cx="250" cy="20" r="16" fill="rgba(255,255,255,0.95)" />
      {/* far hills */}
      <Path d="M0,70 C50,58 100,75 150,65 C200,55 250,75 300,60 L300,120 L0,120 Z" fill="rgba(255,255,255,0.25)" />
      {/* mid hills */}
      <Path d="M0,85 C60,72 120,92 170,82 C220,72 260,88 300,80 L300,120 L0,120 Z" fill="rgba(255,255,255,0.35)" />
      {/* near ground */}
      <Path d="M0,98 C70,90 130,104 190,98 C235,94 270,98 300,96 L300,120 L0,120 Z" fill="rgba(255,255,255,0.45)" />
      {/* slim trees on right */}
      <Rect x="246" y="30" width="8" height="70" rx="4" fill="rgba(255,255,255,0.4)" />
      <Rect x="260" y="45" width="6" height="45" rx="3" fill="rgba(255,255,255,0.35)" />
      {/* tiny rocks */}
      <Circle cx="150" cy="92" r="3" fill="rgba(255,255,255,0.6)" />
      <Circle cx="162" cy="96" r="2" fill="rgba(255,255,255,0.5)" />
    </Svg>
  )
}

function WindyScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      {/* layered green hills */}
      <Path d="M0,76 C55,66 110,82 165,70 C220,58 260,76 300,68 L300,120 L0,120 Z" fill="rgba(255,255,255,0.25)" />
      <Path d="M0,90 C60,80 120,98 180,88 C230,80 265,90 300,86 L300,120 L0,120 Z" fill="rgba(255,255,255,0.35)" />
      <Path d="M0,100 C70,94 140,106 200,100 C240,96 275,100 300,98 L300,120 L0,120 Z" fill="rgba(255,255,255,0.45)" />

      {/* tiny conical trees */}
      <Path d="M70,92 L75,108 L65,108 Z" fill="rgba(255,255,255,0.6)" />
      <Path d="M110,88 L115,106 L105,106 Z" fill="rgba(255,255,255,0.5)" />

      {/* wind strokes */}
      <Path d="M30 45 Q80 35 130 45" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" fill="none" />
      <Path d="M90 58 Q140 50 190 58" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" fill="none" />
      <Path d="M160 70 Q210 64 260 70" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" fill="none" />

      {/* windmill tower */}
      <Rect x="230" y="50" width="18" height="58" rx="5" fill="rgba(255,255,255,0.7)" />
      {/* windmill head */}
      <Circle cx="239" cy="46" r="7" fill="rgba(255,255,255,0.9)" />
      {/* blades */}
      <Line x1="239" y1="46" x2="270" y2="46" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <Line x1="239" y1="46" x2="208" y2="46" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <Line x1="239" y1="46" x2="239" y2="15" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
      <Line x1="239" y1="46" x2="239" y2="77" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
    </Svg>
  )
}

/** FOG scene: lighthouse + soft fog layers + moon + birds */
function FogScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      {/* moon */}
      <Circle cx="220" cy="22" r="14" fill="rgba(255,255,255,0.95)" />

      {/* far foggy hills */}
      <Path d="M0,68 C60,58 120,72 180,63 C225,56 265,70 300,60 L300,120 L0,120 Z" fill="rgba(255,255,255,0.25)" />
      <Path d="M0,80 C65,72 130,88 190,78 C235,72 270,82 300,78 L300,120 L0,120 Z" fill="rgba(255,255,255,0.35)" />
      <Path d="M0,92 C70,88 140,98 200,92 C240,88 275,92 300,90 L300,120 L0,120 Z" fill="rgba(255,255,255,0.45)" />

      {/* low fog bands */}
      <Path d="M10 50 Q70 44 130 50 T250 50" stroke="rgba(255,255,255,0.65)" strokeWidth="3.5" fill="none" />
      <Path d="M40 60 Q100 54 160 60 T290 60" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" fill="none" />

      {/* birds */}
      <Path d="M150 30 q6 -5 12 0" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M165 34 q6 -5 12 0" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* lighthouse base rock */}
      <Path d="M228,96 C234,92 244,92 252,96 C244,100 234,100 228,96 Z" fill="rgba(0,0,0,0.15)" />

      {/* lighthouse tower */}
      <Rect x="234" y="45" width="20" height="58" rx="5" fill="rgba(255,255,255,0.8)" />
      {/* stripes */}
      <Rect x="234" y="55" width="20" height="12" fill="rgba(255,255,255,0.6)" />
      <Rect x="234" y="75" width="20" height="12" fill="rgba(255,255,255,0.6)" />
      {/* windows */}
      <Rect x="240" y="53" width="5" height="7" rx="1.5" fill="rgba(255,255,255,0.95)" />
      <Rect x="240" y="73" width="5" height="7" rx="1.5" fill="rgba(255,255,255,0.95)" />

      {/* lantern room & cap */}
      <Rect x="229" y="35" width="30" height="14" rx="7" fill="rgba(255,255,255,0.9)" />
      <Rect x="236" y="30" width="16" height="5" rx="2.5" fill="rgba(255,255,255,0.7)" />
      <Circle cx="244" cy="42" r="5" fill="rgba(255,255,255,0.98)" />
    </Svg>
  )
}

/** SNOW scene: purple sky, snowy hills, house with warm windows, flakes */
function SnowScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      {/* distant snowy hills */}
      <Path d="M0,72 C55,60 115,78 170,68 C215,60 255,74 300,64 L300,120 L0,120 Z" fill="rgba(255,255,255,0.25)" />
      <Path d="M0,84 C60,74 120,94 180,84 C230,76 265,88 300,82 L300,120 L0,120 Z" fill="rgba(255,255,255,0.35)" />
      {/* foreground snow */}
      <Path d="M0,98 C70,92 140,106 200,98 C240,94 275,98 300,96 L300,120 L0,120 Z" fill="rgba(255,255,255,0.5)" />

      {/* soft sky swirl */}
      <Path
        d="M20 48 Q90 38 160 48 T300 48"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* tiny snowy mounds / rocks */}
      <Path d="M140,96 C144,94 148,94 152,96 C148,98 144,98 140,96 Z" fill="rgba(0,0,0,0.1)" />
      <Path d="M170,100 C173,98 176,98 179,100 C176,102 173,102 170,100 Z" fill="rgba(0,0,0,0.08)" />

      {/* conical trees */}
      <Polygon points="84,92 90,108 78,108" fill="rgba(255,255,255,0.7)" />
      <Polygon points="120,88 126,106 114,106" fill="rgba(255,255,255,0.65)" />

      {/* house (right) */}
      {/* roof */}
      <Polygon points="228,66 246,56 264,66" fill="rgba(255,255,255,0.6)" />
      {/* body */}
      <Rect x="232" y="66" width="32" height="24" rx="4" fill="rgba(255,255,255,0.8)" />
      {/* windows (warm light) */}
      <Rect x="240" y="72" width="8" height="8" rx="2" fill="#FFE37A" />
      <Rect x="252" y="72" width="8" height="8" rx="2" fill="#FFE37A" />
      {/* snowy cap on roof */}
      <Path d="M226,64 C238,58 254,58 266,64 L266,66 L226,66 Z" fill="rgba(255,255,255,0.9)" />

      {/* snowflakes - better distributed */}
      <Circle cx="36" cy="28" r="1.8" fill="rgba(255,255,255,0.95)" />
      <Circle cx="62" cy="36" r="1.4" fill="rgba(255,255,255,0.85)" />
      <Circle cx="98" cy="24" r="1.6" fill="rgba(255,255,255,0.9)" />
      <Circle cx="126" cy="42" r="1.3" fill="rgba(255,255,255,0.8)" />
      <Circle cx="156" cy="30" r="1.7" fill="rgba(255,255,255,0.9)" />
      <Circle cx="182" cy="44" r="1.5" fill="rgba(255,255,255,0.88)" />
      <Circle cx="208" cy="32" r="1.4" fill="rgba(255,255,255,0.86)" />
      <Circle cx="264" cy="34" r="1.3" fill="rgba(255,255,255,0.8)" />
      <Circle cx="84" cy="52" r="1.5" fill="rgba(255,255,255,0.86)" />
      <Circle cx="140" cy="54" r="1.3" fill="rgba(255,255,255,0.8)" />
      <Circle cx="200" cy="56" r="1.4" fill="rgba(255,255,255,0.84)" />
    </Svg>
  )
}

/** RAIN scene: misty hills, water plane, boat, lanterns, diagonal rain */
function RainScene() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={styles.scene}>
      {/* distant hills */}
      <Path d="M0,64 C60,52 115,72 170,60 C215,50 255,72 300,58 L300,120 L0,120 Z" fill="rgba(255,255,255,0.2)" />
      <Path d="M0,78 C60,68 120,86 180,76 C230,68 265,80 300,74 L300,120 L0,120 Z" fill="rgba(255,255,255,0.3)" />

      {/* water band */}
      <Path d="M0,88 L300,88 L300,120 L0,120 Z" fill="rgba(255,255,255,0.4)" />
      {/* gentle water ripples */}
      <Path d="M20 94 Q70 90 120 94 T220 94 T300 94" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" fill="none" />
      <Path d="M40 100 Q90 96 140 100 T260 100" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" />

      {/* floating lantern lights */}
      <Circle cx="96" cy="92" r="3.5" fill="#FFE37A" opacity={0.95} />
      <Circle cx="158" cy="98" r="3" fill="#FFE37A" opacity={0.9} />
      <Circle cx="210" cy="92" r="3.2" fill="#FFE37A" opacity={0.92} />
      {/* reflections */}
      <Rect x={93} y={96} width={5} height={6} rx={2.5} fill="#FFE37A" opacity={0.4} />
      <Rect x={155} y={101} width={4} height={5} rx={2} fill="#FFE37A" opacity={0.35} />
      <Rect x={207} y={96} width={4.5} height={6} rx={2.25} fill="#FFE37A" opacity={0.37} />

      {/* small boat on right */}
      <Path d="M228,90 c8,-2 22,-2 30,0 c0,0 -3,8 -15,10 c-12,-2 -15,-10 -15,-10 z" fill="rgba(255,255,255,0.6)" />
      <Path d="M232,90 c7,-1 18,-1 26,0" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" />
      {/* boat inner seat & glow */}
      <Rect x="240" y="91" width="7" height="4" rx="2" fill="#FFE37A" opacity={0.8} />

      {/* diagonal raindrops - more prominent */}
      <Line x1="10" y1="8" x2="2" y2="28" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      <Line x1="42" y1="4" x2="34" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
      <Line x1="78" y1="12" x2="70" y2="32" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8" />
      <Line x1="112" y1="6" x2="104" y2="26" stroke="rgba(255,255,255,0.43)" strokeWidth="1.8" />
      <Line x1="146" y1="10" x2="138" y2="30" stroke="rgba(255,255,255,0.44)" strokeWidth="1.8" />
      <Line x1="180" y1="4" x2="172" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" />
      <Line x1="214" y1="8" x2="206" y2="28" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8" />
      <Line x1="248" y1="6" x2="240" y2="26" stroke="rgba(255,255,255,0.41)" strokeWidth="1.8" />
      <Line x1="282" y1="10" x2="274" y2="30" stroke="rgba(255,255,255,0.43)" strokeWidth="1.8" />
    </Svg>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 2.1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  top: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 18,
    zIndex: 2,
  },
  cornerIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 3,
  },
  textBlock: {
    gap: 3,
    zIndex: 3,
  },
  temperature: {
    fontSize: 44,
    fontWeight: "800",
    lineHeight: 48,
    letterSpacing: -1,
  },
  condition: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  sceneContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  scene: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  bottom: {
    height: 44,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  time: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  leftBlock: {
    flexDirection: "column",
  },
  shortAddress: {
    fontSize: 13,
    
  },
  city: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
    paddingBottom: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
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
      paddingVertical: vs(22),
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
        padding: 8,
        paddingBottom: 0,

      },
})
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as Location from "expo-location";

type LocationState = {
  latitude: number;
  longitude: number;
  city?: string;
  permission: "granted" | "denied" | "undetermined";
};

type WeatherState = {
  temperature: number; // °C
  condition:
    | "sunny"
    | "cloudy"
    | "rainy"
    | "snowy"
    | "thunderstorm"
    | "foggy"
    | "windy";
  locationLabel: string;
  raw?: any;
};

type ContextShape = {
  location: LocationState | null;
  weather: WeatherState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const Ctx = createContext<ContextShape | undefined>(undefined);

// --- helpers ---------------------------------------------------------

function conditionFromCode(code: number): WeatherState["condition"] {
  if ([0].includes(code)) return "sunny";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "foggy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snowy";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "cloudy";
}

async function getPermissionAndCoords(): Promise<LocationState> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return {
      latitude: 0,
      longitude: 0,
      permission: "denied",
      city: undefined,
    };
  }
  const pos = await Location.getCurrentPositionAsync({});
  let city: string | undefined;
  try {
    const rev = await Location.reverseGeocodeAsync({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
    city = rev?.[0]?.city || rev?.[0]?.name || undefined;
  } catch {}
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    city,
    permission: "granted",
  };
}

async function fetchWeatherFor(lat: number, lon: number): Promise<WeatherState> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  const json = await res.json();
  const curr = json.current_weather;
  return {
    temperature: Math.round(curr.temperature),
    condition: conditionFromCode(curr.weathercode),
    locationLabel: "", // filled from location.city below
    raw: json,
  };
}

// --- provider --------------------------------------------------------

export function LocationWeatherProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const didInitRef = useRef(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await getPermissionAndCoords();
      setLocation(loc);

      if (loc.permission === "granted") {
        const wx = await fetchWeatherFor(loc.latitude, loc.longitude);
        setWeather({
          ...wx,
          locationLabel: loc.city || wx.locationLabel || "Current location",
        });
      } else {
        setWeather(null);
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load location/weather");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void loadAll(); // once per cold app open
  }, [loadAll]);

  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const value: ContextShape = { location, weather, loading, error, refresh };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocationWeather() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocationWeather must be used inside LocationWeatherProvider");
  return ctx;
}

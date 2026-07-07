import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, Snowflake, Sun } from 'lucide-react';

export interface WeatherData {
  temperature: number;
  condition: string;
  isDay: boolean;
  code: number;
}

// Map WMO weather codes to readable conditions
export const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
};

// Return the appropriate Lucide icon component based on WMO code
export const getWeatherIcon = (code: number) => {
  if (code === 0) return Sun;
  if (code === 1 || code === 2 || code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 55) return CloudDrizzle;
  if (code >= 61 && code <= 65 || (code >= 80 && code <= 82)) return CloudRain;
  if (code >= 71 && code <= 77) return Snowflake;
  if (code >= 95) return CloudLightning;
  return Cloud;
};

// Cache to prevent duplicate calls for the same city
const weatherCache = new Map<string, { data: WeatherData, timestamp: number }>();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherData | null> => {
  const cacheKey = `${lat},${lng}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
    return cached.data;
  }
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const json = await res.json();
    const data: WeatherData = {
      temperature: Math.round(json.current.temperature_2m),
      condition: getWeatherCondition(json.current.weather_code),
      isDay: json.current.is_day === 1,
      code: json.current.weather_code
    };
    
    weatherCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error('Failed to fetch weather:', err);
    return null;
  }
};

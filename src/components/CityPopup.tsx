import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { formatCityTime, formatCityDate, getUTCOffset } from '../utils/time';
import { getSeason } from '../utils/season';
import { fetchWeather, type WeatherData, getWeatherIcon } from '../utils/weather';
import { getMoonPhaseIconSVG, getMoonPhaseName } from '../utils/astronomy';
import { X, MapPin, Moon, Sun, Sunrise, Sunset, CalendarPlus } from 'lucide-react';
import * as SunCalc from 'suncalc';

export const CityPopup = () => {
  const { selectedCity, setSelectedCity, is24Hour, showSeconds, simulatedTime, addComparedCity, setPlannerOpen } = useAppStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    if (simulatedTime !== null) {
      setCurrentTime(simulatedTime);
      return;
    }
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [simulatedTime]);

  useEffect(() => {
    if (!selectedCity) return;
    let isMounted = true;
    setLoadingWeather(true);
    
    fetchWeather(selectedCity.lat, selectedCity.lng).then(data => {
      if (isMounted) {
        setWeather(data);
        setLoadingWeather(false);
      }
    });
    
    return () => { isMounted = false; };
  }, [selectedCity]);

  if (!selectedCity) return null;

  const timeString = formatCityTime(currentTime, selectedCity.timezone, is24Hour, showSeconds);
  const dateString = formatCityDate(currentTime, selectedCity.timezone);
  const offsetString = getUTCOffset(currentTime, selectedCity.timezone);

  // Calculate sun times
  const sunTimes = SunCalc.getTimes(new Date(currentTime), selectedCity.lat, selectedCity.lng);
  const moonIllum = SunCalc.getMoonIllumination(new Date(currentTime));
  
  // Format sun times to local city time
  const sunriseStr = formatCityTime(sunTimes.sunrise.getTime(), selectedCity.timezone, is24Hour, false);
  const sunsetStr = formatCityTime(sunTimes.sunset.getTime(), selectedCity.timezone, is24Hour, false);
  
  // Determine if it's day or night in that city
  const isDay = currentTime > sunTimes.sunrise.getTime() && currentTime < sunTimes.sunset.getTime();
  const season = getSeason(new Date(currentTime), selectedCity.lat);
  
  const WeatherIcon = weather ? getWeatherIcon(weather.code) : null;

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-24 right-6 w-80 z-20 pointer-events-auto bg-base-100/85 backdrop-blur-xl border border-base-content/10 shadow-2xl rounded-3xl overflow-hidden"
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className={`h-24 p-6 relative overflow-hidden flex flex-col justify-end ${isDay ? 'bg-linear-to-br from-sky-400/20 to-blue-500/20' : 'bg-linear-to-br from-indigo-900/40 to-slate-900/40'}`}>
          <button 
            onClick={() => setSelectedCity(null)}
            className="absolute top-4 right-4 btn btn-circle btn-xs btn-ghost text-base-content bg-base-100/50 hover:bg-base-100"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 text-base-content">
            <MapPin size={18} className="opacity-80" />
            <h2 className="text-2xl font-bold tracking-tight m-0">{selectedCity.name}</h2>
          </div>
          <div className="text-sm font-medium opacity-70 ml-7">{selectedCity.country}</div>
          
          <button 
            onClick={() => {
              addComparedCity(selectedCity);
              setPlannerOpen(true);
            }}
            className="absolute bottom-6 right-6 btn btn-circle btn-sm btn-primary shadow-lg hover:scale-110 transition-transform"
            title="Add to Meeting Planner"
          >
            <CalendarPlus size={16} />
          </button>
          
          <div className="absolute top-4 left-6 opacity-20">
            {isDay ? <Sun size={64} /> : <Moon size={64} />}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* Main Time Display */}
          <div>
            <div className="flex justify-between items-start">
              <div className="text-4xl font-light tabular-nums tracking-tight text-primary mb-1">{timeString}</div>
              
              {/* Weather Chip */}
              <div className="flex items-center gap-2 bg-base-200/60 rounded-full px-3 py-1.5 shadow-xs border border-base-content/5 mt-1">
                {loadingWeather || !weather ? (
                  <span className="text-xs opacity-50">Loading...</span>
                ) : (
                  <>
                    {WeatherIcon && <WeatherIcon size={16} className="text-primary" />}
                    <span className="text-sm font-semibold">{weather.temperature}°C</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-sm text-base-content/70 flex justify-between items-center mt-2">
              <span>{dateString}</span>
              <div className="flex gap-2">
                <span className="badge badge-sm badge-outline">UTC {offsetString}</span>
                <span className="badge badge-sm badge-secondary badge-outline">{season}</span>
              </div>
            </div>
          </div>

          {/* Environmental Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-base-200/40 rounded-xl p-3 flex flex-col gap-1 border border-base-content/5 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5"><Sunrise size={12}/> Sunrise</div>
              <div className="text-lg font-medium">{sunriseStr}</div>
            </div>
            <div className="bg-base-200/40 rounded-xl p-3 flex flex-col gap-1 border border-base-content/5 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1.5"><Sunset size={12}/> Sunset</div>
              <div className="text-lg font-medium">{sunsetStr}</div>
            </div>
            <div className="col-span-2 bg-base-200/40 rounded-xl p-3 flex justify-between items-center border border-base-content/5 backdrop-blur-md mt-1">
              <div className="flex flex-col gap-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">Moon Phase</div>
                <div className="text-sm font-medium">{getMoonPhaseName(moonIllum.phase)}</div>
              </div>
              <div className="text-3xl leading-none">{getMoonPhaseIconSVG(moonIllum.phase)}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

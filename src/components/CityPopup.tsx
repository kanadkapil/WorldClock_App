import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { formatCityTime, formatCityDate, getUTCOffset } from '../utils/time';
import { getSeason } from '../utils/season';
import { X, MapPin, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import * as SunCalc from 'suncalc';

export const CityPopup = () => {
  const { selectedCity, setSelectedCity, is24Hour, showSeconds, simulatedTime } = useAppStore();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (simulatedTime !== null) {
      setCurrentTime(simulatedTime);
      return;
    }
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [simulatedTime]);

  if (!selectedCity) return null;

  const timeString = formatCityTime(currentTime, selectedCity.timezone, is24Hour, showSeconds);
  const dateString = formatCityDate(currentTime, selectedCity.timezone);
  const offsetString = getUTCOffset(currentTime, selectedCity.timezone);

  // Calculate sun times
  const sunTimes = SunCalc.getTimes(new Date(currentTime), selectedCity.lat, selectedCity.lng);
  
  // Format sun times to local city time
  const sunriseStr = formatCityTime(sunTimes.sunrise.getTime(), selectedCity.timezone, is24Hour, false);
  const sunsetStr = formatCityTime(sunTimes.sunset.getTime(), selectedCity.timezone, is24Hour, false);
  
  // Determine if it's day or night in that city
  const isDay = currentTime > sunTimes.sunrise.getTime() && currentTime < sunTimes.sunset.getTime();
  const season = getSeason(new Date(currentTime), selectedCity.lat);

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
          
          <div className="absolute top-4 left-6 opacity-20">
            {isDay ? <Sun size={64} /> : <Moon size={64} />}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <div className="text-4xl font-light tabular-nums tracking-tight text-primary mb-1">{timeString}</div>
            <div className="text-sm text-base-content/70 flex justify-between items-center mt-2">
              <span>{dateString}</span>
              <div className="flex gap-2">
                <span className="badge badge-sm badge-outline">UTC {offsetString}</span>
                <span className="badge badge-sm badge-secondary badge-outline">{season}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base-200/50 rounded-xl p-3 flex flex-col gap-1 border border-base-content/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1"><Sunrise size={14}/> Sunrise</div>
              <div className="text-lg font-medium">{sunriseStr}</div>
            </div>
            <div className="bg-base-200/50 rounded-xl p-3 flex flex-col gap-1 border border-base-content/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/50 flex items-center gap-1"><Sunset size={14}/> Sunset</div>
              <div className="text-lg font-medium">{sunsetStr}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { formatCityTime, formatCityDate, getUserTimezone } from '../utils/time';
import { Settings, X } from 'lucide-react';

export const PersonalClock = () => {
  const { is24Hour, showSeconds, setFormat, setSeconds, simulatedTime } = useAppStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);
  const userTz = getUserTimezone();

  useEffect(() => {
    // If we have a simulated time, don't tick the clock, just use the simulated time
    if (simulatedTime !== null) {
      setCurrentTime(simulatedTime);
      return;
    }

    // Otherwise, tick every second
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [simulatedTime]);

  const timeString = formatCityTime(currentTime, userTz, is24Hour, showSeconds);
  const dateString = formatCityDate(currentTime, userTz);

  return (
    <div className="absolute bottom-6 left-6 z-10 pointer-events-auto">
      <motion.div 
        className="bg-base-100/80 backdrop-blur-md border border-base-content/10 shadow-2xl rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 flex items-center justify-between gap-6">
          <div>
            <div className="text-xs text-base-content/60 uppercase font-semibold tracking-wider mb-1">Local Time</div>
            <div className="text-3xl font-light tabular-nums tracking-tight">{timeString}</div>
            <div className="text-sm text-base-content/80 mt-1">{dateString}</div>
          </div>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-base-content"
          >
            {showSettings ? <X size={18} /> : <Settings size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-base-200/50 border-t border-base-content/5 px-4 py-3 flex flex-col gap-2"
            >
              <label className="label cursor-pointer p-0">
                <span className="label-text text-xs">24-Hour Format</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-xs toggle-primary" 
                  checked={is24Hour}
                  onChange={(e) => setFormat(e.target.checked)}
                />
              </label>
              <label className="label cursor-pointer p-0">
                <span className="label-text text-xs">Show Seconds</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-xs toggle-primary" 
                  checked={showSeconds}
                  onChange={(e) => setSeconds(e.target.checked)}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, type CityData } from '../store/useAppStore';
import { formatCityTime, formatCityDate, getUTCOffset } from '../utils/time';
import { X, Trash2, CalendarClock } from 'lucide-react';

const CityRow = ({ city, currentTime }: { city: CityData; currentTime: number }) => {
  const { removeComparedCity, is24Hour } = useAppStore();
  
  const timeString = formatCityTime(currentTime, city.timezone, is24Hour, false);
  const dateString = formatCityDate(currentTime, city.timezone);
  const offsetString = getUTCOffset(currentTime, city.timezone);

  // Determine if it's business hours (9 AM - 5 PM)
  const cityDate = new Date(new Date(currentTime).toLocaleString('en-US', { timeZone: city.timezone }));
  const hour = cityDate.getHours();
  const isBusinessHours = hour >= 9 && hour < 17;
  const isWarningHours = (hour >= 7 && hour < 9) || (hour >= 17 && hour < 19);

  let statusColor = 'bg-error/20 text-error';
  if (isBusinessHours) statusColor = 'bg-success/20 text-success';
  else if (isWarningHours) statusColor = 'bg-warning/20 text-warning';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-base-200/50 border border-base-content/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${statusColor.split(' ')[0]}`} />
      
      <div className="flex justify-between items-start ml-2">
        <div>
          <h3 className="font-bold text-lg leading-tight">{city.name}</h3>
          <span className="text-xs opacity-70">UTC {offsetString}</span>
        </div>
        
        <button 
          onClick={() => removeComparedCity(city.id)}
          className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-error"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex justify-between items-end ml-2">
        <div>
          <div className="text-3xl font-light tabular-nums tracking-tight text-primary">{timeString}</div>
          <div className="text-xs opacity-70 mt-1">{dateString}</div>
        </div>
        
        <div className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${statusColor}`}>
          {isBusinessHours ? 'Business' : isWarningHours ? 'Extended' : 'Outside'}
        </div>
      </div>
    </motion.div>
  );
};

export const MeetingPlanner = () => {
  const { isPlannerOpen, setPlannerOpen, comparedCities, simulatedTime } = useAppStore();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (simulatedTime !== null) {
      setCurrentTime(simulatedTime);
      return;
    }
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [simulatedTime]);

  return (
    <AnimatePresence>
      {isPlannerOpen && (
        <motion.div
          className="absolute top-24 left-6 w-[340px] bottom-32 z-20 pointer-events-auto bg-base-100/85 backdrop-blur-xl border border-base-content/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="h-20 bg-primary/10 border-b border-primary/20 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl text-primary">
                <CalendarClock size={20} />
              </div>
              <h2 className="text-xl font-bold">Meeting Planner</h2>
            </div>
            <button 
              onClick={() => setPlannerOpen(false)}
              className="btn btn-circle btn-sm btn-ghost hover:bg-base-200"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {comparedCities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-6 gap-4">
                <CalendarClock size={48} className="opacity-50" />
                <p className="text-sm">Add cities from the map or search to compare their local times and find overlapping business hours.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {comparedCities.map(city => (
                  <CityRow key={city.id} city={city} currentTime={currentTime} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

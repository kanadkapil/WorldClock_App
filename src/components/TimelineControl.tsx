import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Play, Pause, FastForward, RotateCcw, CalendarClock } from 'lucide-react';
import { motion } from 'framer-motion';

export const TimelineControl = () => {
  const { simulatedTime, setSimulatedTime } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(3600); // Default: 1 real second = 1 simulated hour
  
  // Stable reference for slider window: current time +/- 7 days
  const [baseTime] = useState(Date.now());
  const minTime = baseTime - 7 * 24 * 60 * 60 * 1000;
  const maxTime = baseTime + 7 * 24 * 60 * 60 * 1000;
  
  const currentVal = simulatedTime ?? Date.now();

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      let lastTick = performance.now();
      interval = window.setInterval(() => {
        const now = performance.now();
        const deltaMs = now - lastTick;
        lastTick = now;
        
        const prev = useAppStore.getState().simulatedTime;
        const t = prev ?? Date.now();
        setSimulatedTime(t + deltaMs * speedMultiplier);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, setSimulatedTime]);

  // If live time is active but slider moves, we want to freeze the base display?
  // Actually, if simulatedTime is null, the Live clock handles it. But we need a local tick for the LIVE display.
  const [liveDisplay, setLiveDisplay] = useState(Date.now());
  useEffect(() => {
    if (simulatedTime === null) {
      const id = setInterval(() => setLiveDisplay(Date.now()), 1000);
      return () => clearInterval(id);
    }
  }, [simulatedTime]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulatedTime(parseInt(e.target.value, 10));
    setIsPlaying(false);
  };

  const resetToLive = () => {
    setSimulatedTime(null);
    setIsPlaying(false);
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleString(undefined, { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full max-w-3xl px-4"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="badge badge-primary badge-lg shadow-lg font-mono px-4 py-4 text-sm gap-2 whitespace-nowrap bg-base-100/90 backdrop-blur-xl border-primary/30 text-primary">
        <CalendarClock size={16} />
        {simulatedTime ? formatDate(simulatedTime) : 'LIVE: ' + formatDate(liveDisplay)}
        
        <input 
          type="datetime-local" 
          className="bg-transparent border-none text-xs ml-2 cursor-pointer focus:outline-none"
          value={new Date(currentVal - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
          onChange={(e) => {
            const d = new Date(e.target.value);
            if (!isNaN(d.getTime())) {
              setSimulatedTime(d.getTime());
              setIsPlaying(false);
            }
          }}
        />
      </div>

      <div className="bg-base-100/80 backdrop-blur-xl rounded-full shadow-2xl border border-base-content/10 p-2 flex items-center gap-3 w-full">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-circle btn-sm ml-1 ${isPlaying ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-circle btn-ghost btn-sm"
          onClick={() => setSpeedMultiplier(prev => prev === 3600 ? 86400 : 3600)} 
          title={`Speed: ${speedMultiplier === 3600 ? '1 hr/s' : '1 day/s'}`}
          aria-label="Toggle simulation speed"
        >
          <FastForward size={16} className={speedMultiplier > 3600 ? 'text-primary' : ''} />
        </motion.button>

        <input 
          type="range" 
          min={minTime} 
          max={maxTime} 
          value={currentVal}
          onChange={handleSliderChange}
          className="range range-xs range-primary flex-1 mx-2" 
        />

        <motion.button 
          whileHover={simulatedTime ? { scale: 1.05 } : {}}
          whileTap={simulatedTime ? { scale: 0.95 } : {}}
          className={`btn btn-ghost btn-sm rounded-full mr-1 ${!simulatedTime ? 'btn-disabled opacity-50' : ''}`}
          onClick={resetToLive}
          aria-label="Reset to Live Time"
          title="Reset to Live Time"
        >
          <RotateCcw size={14} className="mr-1" /> Live
        </motion.button>
      </div>
    </motion.div>
  );
};

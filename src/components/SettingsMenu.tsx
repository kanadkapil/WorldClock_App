import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';

export const SettingsMenu = () => {
  const { is24Hour, setFormat, showSeconds, setSeconds } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className={`btn btn-circle btn-sm ${isOpen ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Settings"
        title="Settings"
      >
        <Settings size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-3 p-4 shadow-xl bg-base-100 rounded-2xl w-64 border border-base-content/10 z-50 flex flex-col gap-4"
          >
            <h3 className="font-bold text-sm text-base-content/70 uppercase tracking-wider">Preferences</h3>
            
            <div className="flex flex-col gap-3">
              <label className="cursor-pointer flex items-center justify-between">
                <span className="label-text font-medium">Use 24-hour clock</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary toggle-sm" 
                  checked={is24Hour} 
                  onChange={(e) => setFormat(e.target.checked)} 
                />
              </label>

              <label className="cursor-pointer flex items-center justify-between">
                <span className="label-text font-medium">Show seconds</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary toggle-sm" 
                  checked={showSeconds} 
                  onChange={(e) => setSeconds(e.target.checked)} 
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

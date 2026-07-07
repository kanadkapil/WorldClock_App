import { create } from 'zustand';

export interface CityData {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface AppState {
  // Preferences
  is24Hour: boolean;
  showSeconds: boolean;
  setFormat: (is24Hour: boolean) => void;
  setSeconds: (showSeconds: boolean) => void;

  // Active City
  selectedCity: CityData | null;
  setSelectedCity: (city: CityData | null) => void;

  // Simulation
  simulatedTime: number | null; // null means live time
  setSimulatedTime: (time: number | null) => void;

  // Meeting Planner
  comparedCities: CityData[];
  addComparedCity: (city: CityData) => void;
  removeComparedCity: (cityId: string) => void;
  isPlannerOpen: boolean;
  setPlannerOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  is24Hour: false,
  showSeconds: true,
  setFormat: (is24Hour) => set({ is24Hour }),
  setSeconds: (showSeconds) => set({ showSeconds }),

  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),

  simulatedTime: null,
  setSimulatedTime: (time) => set({ simulatedTime: time }),

  comparedCities: [],
  addComparedCity: (city) => set((state) => {
    if (state.comparedCities.find(c => c.id === city.id)) return state;
    return { comparedCities: [...state.comparedCities, city] };
  }),
  removeComparedCity: (cityId) => set((state) => ({
    comparedCities: state.comparedCities.filter(c => c.id !== cityId)
  })),
  isPlannerOpen: false,
  setPlannerOpen: (isOpen) => set({ isPlannerOpen: isOpen }),
}));

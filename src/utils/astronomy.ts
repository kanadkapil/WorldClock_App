export const getMoonPhaseName = (phase: number): string => {
  if (phase < 0.03 || phase > 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
};

export const getMoonPhaseIconSVG = (phase: number): string => {
  // We can return a specific character or SVG, but for simplicity, returning a string name
  // that can be mapped to an SVG or icon in the UI. 
  // Let's rely on lucide-react in the UI for now, or just use text if no specific moon icons exist.
  // Actually, Lucide doesn't have all moon phases, so we will use an emoji or simple text.
  const name = getMoonPhaseName(phase);
  const map: Record<string, string> = {
    'New Moon': '🌑',
    'Waxing Crescent': '🌒',
    'First Quarter': '🌓',
    'Waxing Gibbous': '🌔',
    'Full Moon': '🌕',
    'Waning Gibbous': '🌖',
    'Last Quarter': '🌗',
    'Waning Crescent': '🌘',
  };
  return map[name] || '🌕';
};

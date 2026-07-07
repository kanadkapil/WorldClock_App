import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export const TimezoneScale = ({ map, show }: { map: maplibregl.Map | null, show: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!map || !containerRef.current || !show) return;
    const container = containerRef.current;
    
    // Create DOM elements for 3 world copies (-540 to 540) to support infinite scrolling seamlessly
    const els: { el: HTMLDivElement, lng: number }[] = [];
    for (let lng = -540; lng <= 540; lng += 15) {
      const el = document.createElement('div');
      // Hardware-accelerated base classes. We remove dynamic left/top positioning and handle it purely in transform.
      el.className = 'absolute top-0 left-0 text-[11px] font-mono font-bold text-[#c084fc] whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]';
      
      let norm = lng % 360;
      if (norm > 180) norm -= 360;
      if (norm <= -180) norm += 360;
      
      const offsetHours = norm / 15;
      const sign = offsetHours >= 0 ? '+' : '-';
      const absOffset = Math.abs(offsetHours);
      el.textContent = `UTC ${sign}${absOffset.toString().padStart(2, '0')}:00`;
      
      container.appendChild(el);
      els.push({ el, lng });
    }
    
    // Use render event to perfectly sync DOM updates with the WebGL map render loop
    const update = () => {
      for (let i = 0; i < els.length; i++) {
        const { el, lng } = els[i];
        const pos = map.project([lng, 0]);
        // calc(-50%) horizontally centers the text on the exact pixel coordinate.
        el.style.transform = `translate(calc(-50% + ${pos.x}px), 0px)`;
      }
    };
    
    update();
    map.on('render', update);
    
    return () => {
      map.off('render', update);
      container.innerHTML = '';
    };
  }, [map, show]);
  
  if (!show) return null;
  
  return (
    <div 
      className="absolute left-0 right-0 h-6 pointer-events-none z-10 overflow-hidden" 
      style={{ top: '100px' }} 
      ref={containerRef} 
    />
  );
};

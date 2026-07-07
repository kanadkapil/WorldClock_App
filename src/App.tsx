import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { CITIES } from './data/cities';
import { useAppStore } from './store/useAppStore';
import { SearchBox } from './components/SearchBox';
import { PersonalClock } from './components/PersonalClock';
import { CityPopup } from './components/CityPopup';
import { TimelineControl } from './components/TimelineControl';
import { TimezoneScale } from './components/TimezoneScale';
import { getTerminatorGeoJSON, getTimezoneGridGeoJSON } from './utils/terminator';
import { Layers, Globe } from 'lucide-react';

const MAP_STYLES = [
  { id: 'dark', name: 'Dark Mode', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  { id: 'light', name: 'Light Mode', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
  { id: 'voyager', name: 'Voyager', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' }
];

function App() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { selectedCity, setSelectedCity, simulatedTime } = useAppStore();
  const [mapStyle, setMapStyle] = useState(MAP_STYLES[0]);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle.url,
      center: [0, 20],
      zoom: 1.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    const addCustomLayers = () => {
      if (!map.getSource('terminator')) {
        map.addSource('terminator', {
          type: 'geojson',
          data: getTerminatorGeoJSON(new Date())
        });
        map.addLayer({
          id: 'terminator-layer',
          type: 'fill',
          source: 'terminator',
          paint: {
            'fill-color': '#000000',
            'fill-opacity': 0.4
          }
        });
      }

      if (!map.getSource('timezone-grid')) {
        map.addSource('timezone-grid', {
          type: 'geojson',
          data: getTimezoneGridGeoJSON()
        });
        map.addLayer({
          id: 'timezone-grid-layer',
          type: 'line',
          source: 'timezone-grid',
          paint: {
            'line-color': '#c084fc',
            'line-opacity': 0.3,
            'line-dasharray': [2, 4]
          },
          layout: {
            visibility: showGrid ? 'visible' : 'none'
          }
        });
      }
    };

    map.on('style.load', addCustomLayers);

    map.on('load', () => {
      CITIES.forEach((city) => {
        // Outer wrapper for MapLibre positioning and larger click target
        const wrapper = document.createElement('div');
        wrapper.className = 'w-5 h-5 flex items-center justify-center cursor-pointer group';
        
        // Inner element for visual styling and hover scaling (avoids overriding MapLibre's translate transform)
        const inner = document.createElement('div');
        inner.className = 'w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.8)] border border-white/70 transition-transform duration-200 group-hover:scale-[1.15] group-hover:bg-blue-400';
        wrapper.appendChild(inner);
        
        new maplibregl.Marker({ element: wrapper })
          .setLngLat([city.lng, city.lat])
          .addTo(map);

        wrapper.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedCity(city);
        });
      });
    });

    map.on('click', () => {
      setSelectedCity(null);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle map flyTo
  useEffect(() => {
    if (mapRef.current && selectedCity) {
      mapRef.current.flyTo({
        center: [selectedCity.lng, selectedCity.lat],
        zoom: 4,
        speed: 1.2,
        curve: 1.42,
        essential: true,
      });
    }
  }, [selectedCity]);

  // Handle style change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(mapStyle.url);
    }
  }, [mapStyle]);

  // Handle grid toggle
  useEffect(() => {
    if (!mapRef.current) return;
    const layerId = 'timezone-grid-layer';
    if (mapRef.current.getLayer('timezone-grid-layer')) {
      mapRef.current.setLayoutProperty('timezone-grid-layer', 'visibility', showGrid ? 'visible' : 'none');
    }
  }, [showGrid]);
  useEffect(() => {
    if (!mapRef.current) return;
    
    const updateTerminator = () => {
      const source = mapRef.current?.getSource('terminator') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(getTerminatorGeoJSON(simulatedTime ? new Date(simulatedTime) : new Date()));
      }
    };

    // Try immediately in case style is already loaded
    updateTerminator();
    
    // Bind to style.load in case it's mid-transition
    mapRef.current.on('style.load', updateTerminator);

    let interval: number | null = null;
    if (simulatedTime === null) {
      interval = window.setInterval(updateTerminator, 60000); // Update every minute
    }

    return () => {
      if (interval) window.clearInterval(interval);
      mapRef.current?.off('style.load', updateTerminator);
    };
  }, [simulatedTime, mapStyle]);

  return (
    <div className="relative w-full h-full font-sans text-base-content flex flex-col overflow-hidden">
      {/* Header/Nav overlay */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-none flex justify-center">
        <div className="navbar bg-base-100/70 backdrop-blur-xl rounded-full shadow-2xl pointer-events-auto border border-base-content/10 max-w-5xl px-6">
          <div className="flex-1">
            <a className="text-xl font-bold tracking-tighter flex items-center gap-2 text-primary cursor-default">
              <span className="text-2xl">🌍</span> WorldClock
            </a>
          </div>
          <div className="flex-none gap-2 flex items-center">
            <SearchBox />
            
            <button 
                className={`btn btn-circle btn-sm ${showGrid ? 'btn-primary' : 'btn-ghost'} ml-2`}
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Timezone Grid"
              >
                <Globe size={18} />
            </button>
            
            <div className="relative">
              <button 
                className="btn btn-circle btn-ghost btn-sm"
                onClick={() => setShowStyleMenu(!showStyleMenu)}
              >
                <Layers size={18} />
              </button>
              
              {showStyleMenu && (
                <ul className="absolute top-full right-0 mt-2 p-2 shadow menu bg-base-100 rounded-box w-44 border border-base-content/10">
                  {MAP_STYLES.map(style => (
                    <li key={style.id}>
                      <a 
                        className={mapStyle.id === style.id ? 'active' : ''}
                        onClick={() => { setMapStyle(style); setShowStyleMenu(false); }}
                      >
                        {style.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }} className="bg-base-300" />

      {/* Floating Overlays */}
      <TimezoneScale map={mapRef.current} show={showGrid} />
      <CityPopup />
      <PersonalClock />
      <TimelineControl />
    </div>
  );
}

export default App;

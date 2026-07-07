import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CITIES } from '../data/cities';
import { Search } from 'lucide-react';

export const SearchBox = () => {
  const { setSelectedCity } = useAppStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) || 
    city.country.toLowerCase().includes(query.toLowerCase()) ||
    city.timezone.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
          <Search size={16} />
        </div>
        <input 
          type="text" 
          placeholder="Search cities, countries..." 
          className="input input-sm input-bordered w-full pl-9 bg-base-200/50 backdrop-blur"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-base-100/95 backdrop-blur-md border border-base-content/10 shadow-xl rounded-box overflow-hidden">
          {filteredCities.length > 0 ? (
            <ul className="menu menu-sm">
              {filteredCities.map(city => (
                <li key={city.id}>
                  <a 
                    onClick={() => {
                      setSelectedCity(city);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="flex flex-col items-start py-2"
                  >
                    <span className="font-medium">{city.name}</span>
                    <span className="text-xs text-base-content/60">{city.country} • {city.timezone}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-center text-base-content/60">
              No cities found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

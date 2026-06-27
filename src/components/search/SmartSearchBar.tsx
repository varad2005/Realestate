import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building, History, X } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { useNavigate } from 'react-router-dom';

interface SmartSearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
}

export function SmartSearchBar({ initialQuery = '', onSearch }: SmartSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounce suggestions
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const results = await propertyService.getSearchSuggestions(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
    setIsFocused(false);
    
    // Save to recent
    const updatedRecent = [selectedQuery, ...recentSearches.filter(q => q !== selectedQuery)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    
    onSearch(selectedQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSelect(query);
    }
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl z-40">
      <div className={`flex items-center gap-3 bg-white border ${isFocused ? 'border-[#FF3F6C] ring-4 ring-[#FF3F6C]/10' : 'border-gray-300 hover:border-gray-400'} rounded-2xl px-5 py-4 shadow-sm transition-all`}>
        <Search size={22} className={isFocused ? 'text-[#FF3F6C]' : 'text-gray-400'} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by City, Locality, or Project Name..."
          className="bg-transparent text-base outline-none flex-1 text-[#1A1A1A] placeholder:text-gray-400 font-medium"
        />
        {query && (
          <button onClick={() => { setQuery(''); onSearch(''); setIsFocused(false); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={16} />
          </button>
        )}
        <button 
          onClick={() => handleSelect(query)}
          className="hidden md:block bg-[#FF3F6C] text-white px-6 py-2 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 transition-transform"
        >
          Search
        </button>
      </div>

      {isFocused && (query.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {query.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Suggestions</div>
              {suggestions.length > 0 ? suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <MapPin size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{s}</span>
                </button>
              )) : (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">No matching locations found</div>
              )}
            </div>
          ) : (
            <div className="py-2">
              {recentSearches.length > 0 && (
                <>
                  <div className="px-4 py-2 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Recent Searches</span>
                    <span onClick={clearRecent} className="cursor-pointer hover:text-[#FF3F6C]">Clear</span>
                  </div>
                  {recentSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(s)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <History size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{s}</span>
                    </button>
                  ))}
                </>
              )}
              
              <div className="px-4 py-2 mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-50">Popular Cities</div>
              <div className="flex flex-wrap gap-2 px-4 pb-4 mt-2">
                {['Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad'].map(city => (
                  <button 
                    key={city}
                    onClick={() => handleSelect(city)}
                    className="bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-100 hover:border-gray-200 transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

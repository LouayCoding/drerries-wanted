'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string;
}

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/search-members?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleCopyId = (id: string, username: string) => {
    navigator.clipboard.writeText(id);
    setIsOpen(false);
    setQuery('');
    
    // Optional: Show feedback
    const notification = document.createElement('div');
    notification.textContent = `ID copied: ${username}`;
    notification.className = 'fixed top-4 right-4 bg-[#5865f2] text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#72767d]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Zoek server members..."
          className="w-full pl-10 pr-10 py-2.5 bg-[#36393e] text-white placeholder-[#72767d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#2f3136] rounded-lg shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleCopyId(result.id, result.username)}
              className="w-full flex items-center gap-3 p-3 hover:bg-[#36393e] transition-colors text-left"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={result.avatar}
                  alt={result.username}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{result.globalName || result.username}</p>
                <p className="text-sm text-[#72767d] truncate">@{result.username}</p>
              </div>
              <div className="text-xs text-[#5865f2] px-2 py-1 bg-[#5865f2]/10 rounded">
                Copy ID
              </div>
            </button>
          ))}
          <div className="p-3 text-center text-xs text-[#72767d] border-t border-[#36393e]">
            Click to copy ID, then use !addwanted [ID] in Discord
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-[#2f3136] rounded-lg shadow-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-[#72767d] mx-auto mb-2" />
          <p className="text-[#b9bbbe]">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}

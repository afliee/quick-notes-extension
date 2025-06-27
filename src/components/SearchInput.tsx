import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Component for searching through notes by content
 */
export function SearchInput({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search notes...",
  disabled = false 
}: SearchInputProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, onSearchChange]);

  // Sync with external searchTerm changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="mb-4">
      <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-lg transition-all duration-200 min-h-[44px] focus-within:border-blue-500 focus-within:shadow-sm focus-within:shadow-blue-500/10">
        <Search 
          size={16} 
          className="absolute left-3 text-gray-400 pointer-events-none z-10" 
          aria-hidden="true"
        />
        <input
          type="text"
          className="w-full py-3 pl-10 pr-3 border-none bg-transparent text-sm leading-normal text-gray-700 outline-none rounded-md placeholder-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Search notes"
        />
        {localSearchTerm && (
          <button
            type="button"
            className="absolute right-2 flex items-center justify-center w-7 h-7 bg-gray-100 border-none rounded-md text-gray-500 cursor-pointer transition-all duration-200 z-10 hover:bg-gray-200 hover:text-gray-700 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      {localSearchTerm && (
        <div className="mt-2 text-xs text-gray-500 pl-1">
          Press Escape to clear search
        </div>
      )}
    </div>
  );
} 
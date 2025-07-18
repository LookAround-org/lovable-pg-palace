
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Popular area suggestions for Bangalore
  const popularAreas = [
    'Koramangala', 'Whitefield', 'Electronic City', 'JP Nagar', 'Marathahalli',
    'BTM Layout', 'HSR Layout', 'Indiranagar', 'Jayanagar', 'Bellandur'
  ];

  const handleAreaClick = (area: string) => {
    setSearchTerm(area);
    if (onSearch) {
      onSearch(area);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by area (e.g., Koramangala, Whitefield)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-3 w-full text-lg border-2 border-gray-200 focus:border-blue-500 rounded-l-lg rounded-r-none"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-lg font-medium rounded-r-lg rounded-l-none"
        >
          Search
        </Button>
      </div>
      
      {/* Popular Areas */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-600 mr-2">Popular areas:</span>
        {popularAreas.slice(0, 6).map((area) => (
          <button
            key={area}
            onClick={() => handleAreaClick(area)}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
};

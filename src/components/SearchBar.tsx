import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
  onFilterToggle: () => void;
}

const SearchBar = ({ onSearch, onFilterToggle }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    onSearch(query, location);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search jobs, companies, or skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 text-base"
          />
        </div>
        
        <div className="flex-1 relative lg:max-w-xs">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 text-base"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="glass" 
            size="lg"
            onClick={onFilterToggle}
            className="lg:px-4"
          >
            <Filter className="w-5 h-5 lg:mr-2" />
            <span className="hidden lg:inline">Filters</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleSearch}
            className="flex-1 lg:flex-none lg:px-8"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
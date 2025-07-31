import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface FilterState {
  type: string;
  location: string;
  sortBy: string;
}

interface JobFilterProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  resultsCount: number;
  isVisible: boolean;
}

const JobFilter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  resultsCount, 
  isVisible 
}: JobFilterProps) => {
  if (!isVisible) return null;

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship'];
  const locations = ['All', 'Remote', 'New York', 'San Francisco', 'London', 'Seattle', 'Austin'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'company', label: 'Company A-Z' },
  ];

  const hasActiveFilters = filters.type !== 'All' || filters.location !== 'All' || filters.sortBy !== 'newest';

  return (
    <div className="glass-card p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filter Jobs</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {resultsCount} jobs found
          </span>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-secondary hover:text-secondary/80"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <Select value={filters.sortBy} onValueChange={(value) => onFilterChange('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Active filters:</span>
          {filters.type !== 'All' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFilterChange('type', 'All')}
              />
            </Badge>
          )}
          {filters.location !== 'All' && (
            <Badge variant="secondary" className="gap-1">
              Location: {filters.location}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFilterChange('location', 'All')}
              />
            </Badge>
          )}
          {filters.sortBy !== 'newest' && (
            <Badge variant="secondary" className="gap-1">
              Sort: {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => onFilterChange('sortBy', 'newest')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilter;
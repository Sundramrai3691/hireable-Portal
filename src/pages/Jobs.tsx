import { useState, useMemo, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import SearchBar from '@/components/SearchBar';
import JobFilter from '@/components/JobFilter';
import { AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface FilterState {
  type: string;
  location: string;
  sortBy: string;
}

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    location: 'All',
    sortBy: 'newest',
  });

  useEffect(() => {
    let isMounted = true;
    apiClient.getJobs().then((jobs) => {
      if (isMounted) setJobsData(jobs);
    }).catch(() => {
      setJobsData([]);
    });
    return () => { isMounted = false; };
  }, []);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setSearchLocation(location);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'All',
      location: 'All',
      sortBy: 'newest',
    });
    setSearchQuery('');
    setSearchLocation('');
  };

  const filteredJobs = useMemo(() => {
    let filtered = jobsData.filter(job => {
      // Search filter
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location filter
      const matchesSearchLocation = !searchLocation || 
        job.location.toLowerCase().includes(searchLocation.toLowerCase());

      // Type filter
      const matchesType = filters.type === 'All' || job.type === filters.type;

      // Location filter (from dropdown)
      const matchesLocation = filters.location === 'All' || 
        job.location === filters.location ||
        (filters.location === 'Remote' && job.location === 'Remote');

      return matchesSearch && matchesSearchLocation && matchesType && matchesLocation;
    });

    // Sort results
    switch (filters.sortBy) {
      case 'salary-high':
        return filtered.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, '')) || 0;
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, '')) || 0;
          return salaryB - salaryA;
        });
      case 'company':
        return filtered.sort((a, b) => a.company.localeCompare(b.company));
      case 'newest':
      default:
        return filtered.sort((a, b) => {
          const days = { 
            'days ago': (str: string) => parseInt(str.split(' ')[0]) || 0,
            'week ago': () => 7,
            'weeks ago': (str: string) => (parseInt(str.split(' ')[0]) || 0) * 7
          };
          
          const getDays = (posted: string) => {
            if (posted.includes('day')) return days['days ago'](posted);
            if (posted.includes('week ago')) return days['week ago']();
            if (posted.includes('weeks ago')) return days['weeks ago'](posted);
            return 0;
          };
          
          return getDays(a.posted) - getDays(b.posted);
        });
    }
  }, [jobsData, searchQuery, searchLocation, filters]);

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Discover Your Next Opportunity
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse {jobsData.length} open positions from top companies worldwide
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearch}
          onFilterToggle={() => setIsFilterVisible(!isFilterVisible)}
        />

        <JobFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          resultsCount={filteredJobs.length}
          isVisible={isFilterVisible}
        />

        {filteredJobs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button 
              onClick={handleClearFilters}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Showing {filteredJobs.length} of {jobsData.length} jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

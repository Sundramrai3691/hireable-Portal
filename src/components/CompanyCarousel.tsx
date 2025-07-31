import { useEffect, useState } from 'react';
import companiesData from '@/data/companies.json';

const CompanyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const companies = [...companiesData, ...companiesData]; // Duplicate for infinite scroll

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [companies.length]);

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-muted-foreground mb-2">
          Trusted by Leading Companies
        </h2>
        <p className="text-muted-foreground">
          Join thousands of professionals working at top companies
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / 4)}%)`,
            width: `${companies.length * 25}%`
          }}
        >
          {companies.map((company, index) => (
            <div 
              key={`${company.name}-${index}`}
              className="flex-shrink-0 w-1/4 px-4"
            >
              <div className="glass-card p-6 flex items-center justify-center h-20 group hover:scale-105 transition-transform">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-8 max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile carousel indicators */}
      <div className="flex justify-center mt-6 gap-2 md:hidden">
        {Array.from({ length: Math.ceil(companiesData.length / 2) }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / 2) === index ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => setCurrentIndex(index * 2)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyCarousel;
import { useEffect, useState } from "react";
import companiesData from "@/data/companies.json";

const CompanyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const companies = [...companiesData, ...companiesData];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [companies.length]);

  return (
    <div className="py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-muted-foreground">
          Sample Company References
        </h2>
        <p className="text-muted-foreground">
          Legacy carousel data kept as a lightweight visual fallback.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / 4)}%)`,
            width: `${companies.length * 25}%`,
          }}
        >
          {companies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="w-1/4 flex-shrink-0 px-4"
            >
              <div className="glass-card group flex h-20 items-center justify-center p-6 transition-transform hover:scale-105">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-8 max-w-full object-contain opacity-70 transition-opacity group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2 md:hidden">
        {Array.from({ length: Math.ceil(companiesData.length / 2) }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              Math.floor(currentIndex / 2) === index ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => setCurrentIndex(index * 2)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyCarousel;

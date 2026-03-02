import React from 'react';

const TrustedBy = () => {
  const companies = [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-12 border-y border-gray-100 bg-gray-50/50">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {companies.map((i) => (
            <div key={i} className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;

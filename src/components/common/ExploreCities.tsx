import { UIProperty } from "@/services/propertyService";
import { getPropertyImage } from '@/utils/propertyImages';

const CITY_IMAGES: Record<string, string> = {
  "Delhi / NCR": "delhi-ncr",
  "Bangalore": "1555854877-bab0e564b8d5", // This one works
  "Pune": "1564013799919-ab600027ffc6", // This one works
  "Chennai": "chennai-city",
  "Mumbai": "mumbai-city",
  "Hyderabad": "hyderabad-city",
  "Kolkata": "kolkata-city",
  "Ahmedabad": "ahmedabad-city"
};

export function ExploreCities({ properties }: { properties?: UIProperty[] }) {
  const cityCounts = (properties || []).reduce((acc: any, p) => {
    if (p.city) {
      const normalizedCity = p.city.toLowerCase().trim();
      acc[normalizedCity] = (acc[normalizedCity] || 0) + 1;
    }
    return acc;
  }, {});

  const dynamicCities = Object.keys(CITY_IMAGES).map((name) => {
    // Check various forms like "Delhi / NCR", "Delhi", "Mumbai"
    const normalizedName = name.toLowerCase().trim();
    let count = cityCounts[normalizedName] || 0;
    
    // special handling for Delhi / NCR
    if (name === "Delhi / NCR") {
      count = (cityCounts["delhi / ncr"] || 0) + (cityCounts["delhi"] || 0) + (cityCounts["new delhi"] || 0) + (cityCounts["ncr"] || 0);
    }

    return {
      name,
      count: `${count} Propert${count === 1 ? 'y' : 'ies'}`,
      image: CITY_IMAGES[name]
    };
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Top Cities</p>
        <h2 className="text-3xl font-semibold text-gray-900 font-['Poppins']">Explore Properties in Popular Cities</h2>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicCities.length > 0 ? dynamicCities.map((city) => (
          <div 
            key={city.name} 
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex items-center gap-4 cursor-pointer group border border-gray-300/10"
          >
            <img 
              src={getPropertyImage(city.image)} 
              alt={city.name}
              className="w-20 h-20 rounded-lg object-cover shadow-sm group-hover:shadow transition-shadow"
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">{city.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{city.count}</p>
            </div>
          </div>
        )) : <div className="text-gray-500">No properties available to show cities.</div>}
      </div>
    </section>
  );
}

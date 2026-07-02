import { useEffect, useState } from 'react';
import { Property } from '@/types';
import { propertyService } from '@/services/propertyService';
import { PropertyCard } from '@/components/common/PropertyCard';
import { ChevronRight } from 'lucide-react';

export function SimilarProperties({ currentLocality }: { currentLocality: string }) {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // In a real app, you would pass filters to get Similar Properties via API
    propertyService.getAllProperties().then(data => {
      // Fake filtering just to show some cards
      // @ts-ignore
      setProperties(data.slice(0, 4));
    });
  }, [currentLocality]);

  if (properties.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900">Similar Properties</h2>
          <p className="text-gray-500 text-sm mt-1">Properties you might like in {currentLocality}</p>
        </div>
        <button className="text-pink-600 font-bold text-sm flex items-center gap-1 hover:underline">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map(p => (
          // @ts-ignore
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

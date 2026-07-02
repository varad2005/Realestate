import { Amenity } from '@/types';
import * as Icons from 'lucide-react';

export function PropertyAmenities({ amenities }: { amenities: Amenity[] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-bold font-['Poppins'] text-gray-900 mb-6">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {amenities.map((am, index) => {
          // Dynamic icon resolution from lucide-react
          const Icon = (Icons as any)[am.iconName] || Icons.CheckCircle;
          
          return (
            <div key={am.id || index} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-secondary/20 transition-all text-center group cursor-default">
              <div className="w-12 h-12 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icon size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-900">{am.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

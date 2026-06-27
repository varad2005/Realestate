import { LocationAdvantage } from '@/types';
import { MapPin, School, Stethoscope, Train, ShoppingBag, TreePine, Plane, Building, Waypoints } from 'lucide-react';

const typeIcons: Record<string, any> = {
  school: School,
  hospital: Stethoscope,
  transport: Train,
  mall: ShoppingBag,
  park: TreePine,
  metro: Train,
  airport: Plane,
  it_park: Building,
  highway: Waypoints
};

export function LocationAdvantages({ advantages }: { advantages: LocationAdvantage[] }) {
  if (!advantages || advantages.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold font-['Poppins'] text-[#1A1A1A] mb-6 flex items-center gap-2">
        <MapPin className="text-[#FF3F6C]" size={20} /> Location Advantages
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advantages.map((adv) => {
          const Icon = typeIcons[adv.type] || MapPin;
          return (
            <div key={adv.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-[#1A1A1A] text-sm">{adv.name}</p>
                <p className="text-xs text-gray-500">{adv.distance}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

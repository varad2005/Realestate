import { LocationDetails } from '@/types';
import { MapPin, GraduationCap, Stethoscope, ShoppingBag, Train, TreePine } from 'lucide-react';

const iconMap = {
  school: GraduationCap,
  hospital: Stethoscope,
  mall: ShoppingBag,
  transport: Train,
  park: TreePine
};

export function PropertyLocation({ location }: { location: LocationDetails }) {
  if (!location) return null;

  return (
    <div>
      <h3 className="text-xl font-bold font-['Poppins'] text-gray-900 mb-2">Location Advantages</h3>
      <p className="text-sm text-gray-500 flex items-center gap-1 mb-6">
        <MapPin size={14} /> {location.locality}, {location.city}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {location.advantages.map(adv => {
          const Icon = (iconMap as any)[adv.type] || MapPin;
          
          return (
            <div key={adv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 cursor-default">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-pink-600 shadow-sm flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{adv.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{adv.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/10 text-emerald-500 font-bold text-xs px-2 py-1 rounded-md">
                  {adv.distance}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

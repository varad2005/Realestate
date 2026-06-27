import * as LucideIcons from 'lucide-react';
import { Feature } from '@/types';

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, idx) => {
        // Dynamically get the icon from lucide-react
        const Icon = (LucideIcons as any)[feature.iconName] || LucideIcons.Check;

        return (
          <div key={idx} className="bg-[#F5F5F6] p-6 rounded-2xl text-center hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
            <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-[#6C63FF]">
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold font-['Poppins'] text-[#1A1A1A] mb-2">{feature.title}</h3>
            <p className="text-sm text-[#6B7280]">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}

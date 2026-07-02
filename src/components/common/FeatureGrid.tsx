import * as LucideIcons from 'lucide-react';
import { Feature } from '@/types';

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, idx) => {
        // Dynamically get the icon from lucide-react
        const Icon = (LucideIcons as any)[feature.iconName] || LucideIcons.Check;

        return (
          <div key={idx} className="bg-white p-6 rounded-2xl text-center hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-200">
            <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-indigo-600">
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold font-['Poppins'] text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500-foreground">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}

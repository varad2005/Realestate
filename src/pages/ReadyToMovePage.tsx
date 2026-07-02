import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Filter, Search, Map, ChevronDown, KeyRound, Clock, ShieldCheck } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function ReadyToMovePage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const rtmProps = PROPERTIES.filter(p => p.possession === 'Ready to Move');

  return (
    <PageWrapper>
      <div className="bg-white border-2 border-pink-600/10 rounded-[2.5rem] p-12 mb-16 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10" style={{ backgroundImage: `url(${getPropertyImage('670035')})`, backgroundSize: 'cover', backgroundPosition: 'center', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-pink-600/10 text-pink-600 rounded-full flex items-center justify-center">
              <KeyRound size={24} />
            </div>
            <span className="text-pink-600 font-bold uppercase tracking-wider text-sm">Immediate Possession</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] text-gray-900 leading-tight mb-6">
            Move In Today. No Waiting.
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Skip the construction delays. Explore our curated list of 100% completed, ready-to-move-in homes.
          </p>

          <div className="flex gap-6 mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <ShieldCheck size={18} className="text-emerald-500" /> No GST Applicable
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Clock size={18} className="text-indigo-600" /> Zero Waiting Period
            </div>
          </div>
        </div>
      </div>

      <SectionHeader title="Ready to Move Properties" sub="Available for immediate registry" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {rtmProps.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </PageWrapper>
  );
}

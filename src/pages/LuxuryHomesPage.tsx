import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Gem, ShieldCheck, ConciergeBell } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function LuxuryHomesPage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const luxuryProps = PROPERTIES.filter(p => p.priceNum >= 20000000);

  return (
    <PageWrapper>
      <div className="bg-[#0f172a] rounded-[2.5rem] p-12 text-[#e2e8f0] mb-16 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `url(${getPropertyImage('602488')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        
        <div className="relative z-10 max-w-3xl">
          <Gem size={40} className="text-amber-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] text-white leading-tight mb-6">
            The Nestify Prestige Collection
          </h1>
          <p className="text-slate-300 text-lg mb-10">
            A curated portfolio of ultra-luxury villas, penthouses, and bespoke residences.
          </p>

          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <ShieldCheck size={24} className="text-amber-400 mb-2" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Verified Luxury</span>
            </div>
            <div className="w-px h-12 bg-slate-700" />
            <div className="flex flex-col items-center">
              <ConciergeBell size={24} className="text-amber-400 mb-2" />
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">White-Glove Service</span>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader title="Exclusive Residences" sub="Starting from ₹2 Cr" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {luxuryProps.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </PageWrapper>
  );
}

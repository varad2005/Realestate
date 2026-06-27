import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Building2, Briefcase, Coffee, Wifi } from 'lucide-react';

export function CommercialPage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const commercialProps = PROPERTIES.filter(p => p.type === 'commercial');

  return (
    <PageWrapper>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-12 text-white mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-6 inline-block border border-blue-400/30">
            For Businesses
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] leading-tight mb-6">
            Find the Perfect Space for Your Business
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Explore premium offices, retail shops, and co-working spaces in prime business districts.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Building2, label: "Offices" },
              { icon: Briefcase, label: "Co-working" },
              { icon: Coffee, label: "Retail Shops" },
              { icon: Wifi, label: "IT Parks" }
            ].map((amenity, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                <amenity.icon size={24} className="text-blue-400" />
                <span className="text-sm font-bold">{amenity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionHeader title="Premium Commercial Spaces" sub="Handpicked for maximum ROI" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {commercialProps.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
        {/* Fill with mock if empty to show UI */}
        {commercialProps.length === 0 && (
          <p className="text-gray-500 col-span-full">No commercial properties found. Add more to mockData.ts.</p>
        )}
      </div>
    </PageWrapper>
  );
}

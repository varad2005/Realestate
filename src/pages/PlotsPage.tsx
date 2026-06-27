import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Filter, Search, Map, ChevronDown, Check } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function PlotsPage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const plotProps = PROPERTIES.filter(p => p.type === 'plot');

  return (
    <PageWrapper>
      <div className="bg-emerald-900 rounded-[2.5rem] p-12 text-white mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${getPropertyImage('955911')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-emerald-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-6 inline-block border border-white/30">
            Land Investments
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] leading-tight mb-6">
            Invest in Land, Build Your Future
          </h1>
          <p className="text-emerald-100 text-lg mb-8">
            Discover agricultural, residential, and commercial plots with high appreciation potential.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
              View Residential Plots
            </button>
            <button className="bg-emerald-800 text-white border border-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg">
              Explore Farm Lands
            </button>
          </div>
        </div>
      </div>

      <SectionHeader title="Trending Land Parcels" sub="High ROI opportunities" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {plotProps.length > 0 ? plotProps.map(property => (
          <PropertyCard key={property.id} property={property} />
        )) : (
          // Mock data placeholder if no plots exist
          [1,2,3,4].map(i => (
             <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                  <img src={getPropertyImage('955911')} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">PLOT</div>
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Premium Residential Plot</h3>
                <p className="text-sm text-gray-500 mb-2">Hinjewadi Phase 3, Pune</p>
                <p className="font-bold text-[#FF3F6C]">₹45 L</p>
             </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
}

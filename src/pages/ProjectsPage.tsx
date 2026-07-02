import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Filter, Search, Map, ChevronDown, Building2, Crown, CheckCircle2, Building } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function ProjectsPage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const newProjects = PROPERTIES.filter(p => p.badge === 'New' || p.possession !== 'Ready to Move');

  return (
    <PageWrapper>
      <div className="bg-[#1A1A1A] rounded-[2.5rem] p-12 text-white mb-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex-1">
          <span className="bg-purple-600/20 text-purple-600/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-6 inline-block border border-accent/30">
            Pre-launch & Under Construction
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] leading-tight mb-6">
            Discover the Newest Landmarks
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Get early access to upcoming residential projects from top-tier builders.
          </p>
          <ul className="space-y-3 mb-8">
            {["Lower launch prices", "Better choice of units", "Flexible payment plans"].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-500/50">
                <CheckCircle2 size={18} className="text-purple-600" /> {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 flex-1 w-full">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
            <img src={getPropertyImage('880842')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block mb-3">Featured Project</div>
              <h3 className="text-2xl font-bold font-['Poppins'] mb-1">Lodha Panache</h3>
              <p className="text-gray-500/50 text-sm flex items-center gap-2"><Building size={14} /> Hinjewadi, Pune</p>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader title="Newly Launched Projects" sub="Book your unit today" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {newProjects.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </PageWrapper>
  );
}

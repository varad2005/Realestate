import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { ShieldCheck, Percent, FileText } from 'lucide-react';

export function TenantsPage() {
  const [budget, setBudget] = useState<string>("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { properties: PROPERTIES, loading, error } = useAllProperties();

  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  // Filter out just apartments/villas and maybe mock rental prices
  // Since we don't have separate rental properties in mock data, we will just use the existing ones 
  // and pretend they are rentals, filtering by budget string for demonstration.
  const rentalProperties = PROPERTIES.filter(p => p.propertyType !== 'commercial' && p.propertyType !== 'plot');

  const filteredProperties = rentalProperties.filter(p => {
    if (budget === "All") return true;
    const priceNum = typeof p.price === 'number' ? p.price : parseInt(p.price.toString().replace(/[^0-9]/g, '')) || 0;
    if (budget === "Under ₹20K" && priceNum < 20000000) return true; // Just using the logic for demo
    if (budget === "₹20K - ₹40K" && priceNum >= 20000000 && priceNum < 40000000) return true;
    if (budget === "Above ₹40K" && priceNum >= 40000000) return true;
    return false;
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-gray-900 leading-tight mb-4">
            Find Your Perfect <span className="text-pink-600">Rental</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Thousands of zero-brokerage, verified homes. Say goodbye to hefty deposits and hidden fees.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 text-emerald-500 px-4 py-3 rounded-2xl flex items-center gap-3">
            <Percent size={24} />
            <div>
              <p className="font-bold">Zero Brokerage</p>
              <p className="text-xs">On selected homes</p>
            </div>
          </div>
          <div className="bg-indigo-600/10 text-indigo-600 px-4 py-3 rounded-2xl flex items-center gap-3">
            <ShieldCheck size={24} />
            <div>
              <p className="font-bold">100% Verified</p>
              <p className="text-xs">Genuine owners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {["All", "Under ₹20K", "₹20K - ₹40K", "Above ₹40K"].map(b => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                budget === b ? "bg-pink-600 text-white border-pink-600" : "bg-white text-gray-900 border-gray-200 hover:border-pink-600"
              }`}
            >
               {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              wishlisted={wishlist.includes(prop.id)}
              onWishlist={() => toggleWishlist(prop.id)}
            />
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] text-white rounded-3xl p-10 mt-20">
        <SectionHeader title="Tips for Tenants" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {[
            { icon: FileText, title: "Rental Agreement", desc: "Always insist on a registered rental agreement. Read the lock-in period clauses carefully." },
            { icon: ShieldCheck, title: "Security Deposit", desc: "Standard deposit in most cities is 2-3 months rent. Document condition before moving in." },
            { icon: ShieldCheck, title: "Society Rules", desc: "Check if the society has any specific restrictions on pets, guests, or moving times." }
          ].map((tip, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <tip.icon className="text-pink-600" />
              </div>
              <h3 className="font-bold text-lg">{tip.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InfoCard } from '@/components/common/InfoCard';
import { PropertyCard } from '@/components/common/PropertyCard';
import { BUYER_STEPS } from '@/data/mockData';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function BuyersPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  return (
    <PageWrapper>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-gray-900 leading-tight mb-4">
          Home Buying Made <span className="text-pink-600">Simple</span>
        </h1>
        <p className="text-gray-500 text-lg">
          From searching to signing, we guide you through every step of your home buying journey with zero brokerage on verified properties.
        </p>
      </div>

      <div className="mb-20">
        <SectionHeader title="Your Journey to a New Home" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUYER_STEPS.map((step) => (
            <InfoCard key={step.step} number={step.step} title={step.title} desc={step.desc} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
        <div className="bg-indigo-600/10 rounded-3xl p-10 flex flex-col justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white text-2xl font-bold font-['Poppins']">%</span>
          </div>
          <h2 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-4">
            Need a Home Loan?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            Compare rates from 15+ top banks and get instant pre-approval. Our advisors handle the paperwork so you don't have to.
          </p>
          <button className="bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold hover:bg-[#5b54e3] transition-colors self-start shadow-md hover:shadow-lg">
            Check Eligibility
          </button>
        </div>

        <div className="bg-white rounded-3xl p-10 flex flex-col justify-center border border-gray-200">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-4">
            Legal Checklist
          </h2>
          <ul className="space-y-4">
            {["Verify RERA registration", "Check title deed clearance", "Review encumbrance certificate", "Verify approved building plan"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-900">
                <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <SectionHeader title="Recommended For You" action="View All" onAction={() => window.location.href = '/buy'} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPERTIES.slice(0, 3).map((prop) => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              wishlisted={wishlist.includes(prop.id)}
              onWishlist={() => toggleWishlist(prop.id)}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

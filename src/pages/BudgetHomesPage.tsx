import { PageWrapper } from '@/components/layout/PageWrapper';
import { PropertyCard } from '@/components/common/PropertyCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useAllProperties } from '@/features/property/hooks/useAllProperties';
import { Wallet, Calculator, Percent } from 'lucide-react';

export function BudgetHomesPage() {
  const { properties: PROPERTIES, loading, error } = useAllProperties();
  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading properties...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">{error}</div>;

  // Filter for properties <= 50 Lakhs
  const budgetProps = PROPERTIES.filter(p => p.priceNum <= 5000000);

  return (
    <PageWrapper>
      <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-12 mb-16 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1">
          <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
            Affordable Housing
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] text-[#1A1A1A] leading-tight mb-6">
            Your Dream Home, Within Reach
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Explore quality homes under ₹50 Lakhs with special benefits under government housing schemes.
          </p>
          <div className="flex gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-amber-500/20">
              View Properties
            </button>
            <button className="bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
              <Calculator size={18} /> EMI Calculator
            </button>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Wallet size={32} className="text-emerald-500 mx-auto mb-3" />
            <h4 className="font-bold text-[#1A1A1A] mb-1">Low Down Payment</h4>
            <p className="text-xs text-gray-500">Pay as little as 10% upfront to book your home.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Percent size={32} className="text-blue-500 mx-auto mb-3" />
            <h4 className="font-bold text-[#1A1A1A] mb-1">PMAY Subsidy</h4>
            <p className="text-xs text-gray-500">Avail up to ₹2.67 Lakhs subsidy on eligible homes.</p>
          </div>
        </div>
      </div>

      <SectionHeader title="Affordable Homes" sub="Under ₹50 Lakhs" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {budgetProps.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </PageWrapper>
  );
}

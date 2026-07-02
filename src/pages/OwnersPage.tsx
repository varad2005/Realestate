import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InfoCard } from '@/components/common/InfoCard';
import { OWNER_STEPS } from '@/data/mockData';
import { Star, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OwnersPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* Hero Section - High Conversion */}
      <div className="bg-gradient-to-br from-[#FF3F6C] to-[#e62e5c] rounded-[2.5rem] p-10 md:p-20 text-center text-white mb-20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-6 inline-block">
            For Owners & Landlords
          </span>
          <h1 className="text-5xl md:text-6xl font-black font-['Poppins'] leading-tight mb-6">
            Post Your Property for FREE
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sell or rent your property fast. Connect with thousands of verified buyers and tenants directly, with zero brokerage.
          </p>
          <button 
            onClick={() => navigate('/post-property')}
            className="bg-white text-pink-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Post Property Now
          </button>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-4">How it Works</h2>
          <p className="text-gray-500">Three simple steps to close the deal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OWNER_STEPS.map((step) => (
            <InfoCard key={step.step} number={step.step} title={step.title} desc={step.desc} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 border border-gray-200">
        <SectionHeader title="Why choose Nestify?" sub="Benefits of listing directly with us" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {[
            { icon: Users, title: "Millions of Buyers", desc: "Get maximum visibility for your property across our platform." },
            { icon: TrendingUp, title: "Faster Closing", desc: "Properties listed with us close 30% faster than traditional methods." },
            { icon: Star, title: "Premium Tools", desc: "Access pricing insights, high-quality photo guidelines, and more." }
          ].map((benefit, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-indigo-600">
                <benefit.icon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Poppins'] text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-500-foreground leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-['Poppins'] mb-10">What our owners say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {[
            { quote: "I rented my apartment in just 3 days! The quality of leads was fantastic and I saved a month's rent on brokerage.", author: "Amit S.", city: "Bengaluru" },
            { quote: "Selling a house seemed daunting, but the platform made it incredibly easy. Very intuitive interface.", author: "Neha K.", city: "Pune" }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
              <div className="flex gap-1 text-pink-600 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-[#FF3F6C]" />)}
              </div>
              <p className="text-gray-900 italic mb-6 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-bold text-gray-900">{t.author}</p>
                <p className="text-xs text-gray-500">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

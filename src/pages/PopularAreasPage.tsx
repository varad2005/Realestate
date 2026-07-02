import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';

import { DISCOVER_CAROUSEL } from '@/data/mockData';
import { TrendingUp, MapPin } from 'lucide-react';
import { usePopularLocalities } from '@/features/property/hooks/usePopularLocalities';

export function PopularAreasPage() {
  const [activeCity, setActiveCity] = useState("Pune");
  const { localities, loading } = usePopularLocalities();
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] text-gray-900 leading-tight mb-6">
          Trending <span className="text-pink-600">Localities</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Explore the most sought-after neighborhoods based on search volume, lifestyle ratings, and price appreciation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold font-['Poppins'] mb-6 flex items-center gap-2">
              <TrendingUp className="text-pink-600" /> Top Rising Areas
            </h3>
            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-gray-500">Loading localities...</div>
              ) : localities.length === 0 ? (
                <div className="py-10 text-center text-gray-500">No active listings found.</div>
              ) : localities.map((loc, i) => (
                <div key={loc.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-gray-500/50">0{i+1}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{loc.name} <span className="text-xs font-normal text-gray-500 ml-1">({loc.city})</span></p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {loc.propertiesCount} active listings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-500">{loc.yoy}</p>
                    <p className="text-xs text-gray-500 mt-1">Growth YoY</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600/10 rounded-3xl p-8 h-full border border-secondary/20 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <MapPin size={300} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold font-['Poppins'] text-indigo-600 mb-4">Explore by Vibe</h3>
              <div className="grid grid-cols-2 gap-4">
                {DISCOVER_CAROUSEL.slice(0, 4).map(item => (
                  <div key={item.id} onClick={() => navigate(item.link || '/buy')} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-${item.image}?w=800&h=600&fit=crop`} className="w-full h-24 object-cover rounded-xl mb-3" />
                    <p className="font-bold text-sm text-gray-900">{item.title}</p>
                    <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeader } from '@/components/common/SectionHeader';
import { 
  BLOG_POSTS, 
  LOCALITY_REVIEWS, 
  DISCOVER_CAROUSEL, 
  TOP_GAINERS_CITIES, 
  TRANSACTIONS 
} from '@/data/mockData';
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Star, 
  TrendingUp, 
  ChevronRight, 
  Lightbulb, 
  Info,
  BarChart2, 
  PieChart, 
  ArrowRight, 
  Activity, 
  Calendar, 
  Download 
} from 'lucide-react';
import { BlogCard } from '@/components/common/BlogCard';
import { getPropertyImage } from '@/utils/propertyImages';

export function InsightsPage() {

  const [activeGainerTab, setActiveGainerTab] = useState("Pune");

  return (
    <PageWrapper>
      {/* 1. Hero Section (Replicating "Discover Best Places to Live!") */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-10 md:p-16 mb-16 text-center border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-[#FF3F6C] mb-6 shadow-lg">
            <Lightbulb size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-['Poppins'] text-[#1A1A1A] mb-4">
            Discover Best Places to Live!
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            Understand localities, check property rates, reviews, transaction prices & more
          </p>

          <div className="flex w-full max-w-2xl bg-white rounded-xl shadow-md p-2 items-center border border-gray-100">
            <Search size={20} className="text-gray-400 ml-4 mr-2" />
            <input 
              type="text" 
              placeholder="Enter a city, locality or society" 
              className="flex-1 bg-transparent border-none outline-none py-3 text-sm"
            />
            <button className="bg-[#FF3F6C] hover:bg-[#E8355F] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors">
              Search Insights
            </button>
          </div>
        </div>
      </div>

      {/* 2. Discover in [City] (Carousel/Grid) */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold font-['Poppins'] text-[#1A1A1A]">Discover in Pune</h2>
            <p className="text-gray-500 text-sm mt-1">Localities and Societies in Pune</p>
          </div>
          <button className="text-[#FF3F6C] text-sm font-bold border border-[#FF3F6C] px-4 py-2 rounded-lg hover:bg-[#FF3F6C]/5 transition-colors">
            View all Pune Insights
          </button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar">
          {DISCOVER_CAROUSEL.map(item => (
            <div key={item.id} className="min-w-[240px] md:min-w-[280px] h-48 rounded-2xl relative overflow-hidden group cursor-pointer snap-start flex-shrink-0 shadow-sm border border-gray-100">
              <img 
                src={getPropertyImage(item.image)} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white mb-2 inline-block">
                  Top 10
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                <p className="text-white/80 text-xs mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Top Gainers Section */}
      <div className="mb-16 bg-white border border-gray-100 shadow-sm rounded-3xl p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-['Poppins'] text-[#1A1A1A]">Top Gainers</h2>
          <p className="text-gray-500 text-sm mt-1">across India with highest appreciation</p>
        </div>

        <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto hide-scrollbar">
          {Object.keys(TOP_GAINERS_CITIES).map(city => (
            <button 
              key={city}
              onClick={() => setActiveGainerTab(city)}
              className={`pb-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeGainerTab === city ? 'border-[#FF3F6C] text-[#FF3F6C]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-l-xl">Locality</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Rate on Platform</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-r-xl">Price Trends</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_GAINERS_CITIES[activeGainerTab as keyof typeof TOP_GAINERS_CITIES]?.map((loc, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">{loc.name}</p>
                        <p className="text-xs text-gray-500">{loc.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <p className="text-xs text-gray-400 mb-1">Rate on Platform</p>
                    <p className="font-bold font-['Poppins'] text-[#1A1A1A]">{loc.priceRange}</p>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                        <ArrowUpRight size={14} /> {loc.yoy} YoY
                      </span>
                      {/* Fake sparkline graphic */}
                      <div className="w-24 h-4 rounded bg-gradient-to-t from-emerald-100 to-transparent border-t-2 border-emerald-400 opacity-70" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Check Transaction Prices */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold font-['Poppins'] text-[#1A1A1A]">Check Transaction Prices</h2>
          <Info size={18} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm mb-8">of actual sold properties</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 bg-[#1A1A1A] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute -right-4 -top-4 text-white/5">
              <TrendingUp size={150} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold font-['Poppins'] mb-4 leading-tight">Find out actual prices at which properties were sold!</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                We have collected transaction data directly from government registries to bring you 100% accurate property sale records.
              </p>
              <button className="bg-[#FF3F6C] hover:bg-[#E8355F] w-full py-3.5 rounded-xl font-bold transition-colors">
                Search Transactions
              </button>
            </div>
          </div>
          
          <div className="lg:w-2/3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100">
              {['Pune', 'Bangalore', 'Chennai', 'Mumbai'].map(city => (
                <button key={city} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 ${city === 'Pune' ? 'border-[#FF3F6C] text-[#FF3F6C]' : 'border-transparent text-gray-500'}`}>
                  {city}
                </button>
              ))}
            </div>
            <div className="p-2">
              {TRANSACTIONS.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl cursor-pointer group">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{txn.locality}</p>
                    <p className="text-xs text-gray-500 mt-1">{txn.count} properties sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1A1A1A] font-['Poppins']">{txn.avgRate}</p>
                    <p className="text-xs text-[#FF3F6C] group-hover:underline mt-1 font-semibold flex items-center gap-1 justify-end">
                      View all <ChevronRight size={12} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Locality Ratings & Reviews */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-['Poppins'] text-[#1A1A1A]">Ratings & Reviews</h2>
            <p className="text-gray-500 mt-1 text-sm">See what residents and owners have to say</p>
          </div>
          <button className="text-sm font-bold text-[#FF3F6C] hover:underline">
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOCALITY_REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-[#1A1A1A]">{review.locality}</p>
                  <div className="bg-[#FF3F6C]/10 text-[#FF3F6C] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="fill-[#FF3F6C]" /> {review.rating}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{review.text}"</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#1A1A1A]">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">{review.user}</p>
                    <p className="text-[10px] text-gray-500">{review.status}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Articles & News (Existing) */}
      <div>
        <SectionHeader title="Articles & News" sub="Read the latest from our editors" action="View All Articles" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

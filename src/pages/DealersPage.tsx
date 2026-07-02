import { PageWrapper } from '@/components/layout/PageWrapper';
import { FeatureGrid } from '@/components/common/FeatureGrid';
import { BarChart3 } from 'lucide-react';
import { Feature } from '@/types';

export function DealersPage() {
  const dealerFeatures: Feature[] = [
    { title: "Bulk Listings", description: "Upload and manage hundreds of properties seamlessly with our bulk import tools.", iconName: "Database" },
    { title: "Lead Management", description: "Built-in CRM to track, contact, and convert leads faster than ever.", iconName: "MessageSquare" },
    { title: "Analytics Dashboard", description: "Deep insights into property views, click-through rates, and market trends.", iconName: "BarChart3" }
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
        <div className="flex-1 space-y-8">
          <div className="inline-block bg-indigo-600/10 text-indigo-600 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest">
            For Dealers & Builders
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-['Poppins'] text-gray-900 leading-tight">
            Grow Your Real Estate Business
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            Join India's fastest-growing real estate network. Reach millions of verified buyers, manage your portfolio efficiently, and close deals faster with our advanced builder tools.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#1A1A1A] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
              Get Started
            </button>
            <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:border-gray-300 transition-colors">
              Talk to Sales
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6C63FF]/20 to-transparent rounded-[3rem] blur-3xl -z-10 transform translate-x-10 translate-y-10" />
          
          {/* Dashboard mock UI */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <BarChart3 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Seller Dashboard</p>
                  <p className="text-xs text-gray-500">Premium Account</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full">
                Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total Views</p>
                <p className="text-2xl font-bold font-['Poppins']">14.2k</p>
                <p className="text-xs text-emerald-500 mt-1">↑ +12% this week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">New Leads</p>
                <p className="text-2xl font-bold font-['Poppins']">342</p>
                <p className="text-xs text-emerald-500 mt-1">↑ +5% this week</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold mb-3">Recent Inquiries</p>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50/80 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold">User {849 + i}</p>
                        <p className="text-xs text-gray-500">Interested in 3 BHK Villa</p>
                      </div>
                    </div>
                    <div className="text-xs text-pink-600 font-bold bg-pink-600/10 px-2 py-1 rounded">
                      Hot Lead
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-gray-500">Everything you need to scale your real estate business.</p>
        </div>
        <FeatureGrid features={dealerFeatures} />
      </div>
    </PageWrapper>
  );
}

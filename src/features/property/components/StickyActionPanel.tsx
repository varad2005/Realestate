import { DetailedProperty } from '@/types';
import { Heart, Share2, PhoneCall, CalendarCheck } from 'lucide-react';

export function StickyActionPanel({ property }: { property: DetailedProperty }) {
  return (
    <>
      {/* Desktop Sticky Panel (Optional if we use SellerCard, but we add quick actions here) */}
      <div className="hidden lg:flex items-center justify-between bg-white border-t border-gray-100 p-4 sticky bottom-0 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl max-w-[1440px] mx-auto mt-10">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-bold text-[#1A1A1A] font-['Poppins']">{property.price}</p>
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A] text-sm">{property.title}</p>
            <p className="text-xs text-gray-500">{property.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
            <Heart size={20} />
          </button>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
            <Share2 size={20} />
          </button>
          <button className="bg-[#FF3F6C] hover:bg-[#e62e5c] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#FF3F6C]/20 transition-all">
            <PhoneCall size={18} /> Contact Seller
          </button>
        </div>
      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button className="flex-1 bg-white border border-gray-200 text-[#1A1A1A] py-3 rounded-xl font-bold flex justify-center items-center gap-2">
          <CalendarCheck size={18} /> Visit
        </button>
        <button className="flex-1 bg-[#FF3F6C] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-[#FF3F6C]/20">
          <PhoneCall size={18} /> Contact
        </button>
      </div>
    </>
  );
}

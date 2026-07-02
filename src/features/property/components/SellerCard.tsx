import { Seller } from '@/types';
import { Phone, MessageSquare, ShieldCheck, User } from 'lucide-react';

export function SellerCard({ seller }: { seller: Seller }) {
  if (!seller) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {seller.avatarUrl ? (
            <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />
          ) : (
            <User size={24} className="text-gray-500" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold font-['Poppins'] text-gray-900">{seller.name}</h3>
          <p className="text-sm font-medium text-gray-500 mb-2">{seller.role}</p>
          <div className="flex gap-3 text-xs">
            {seller.rating && (
              <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                ★ {seller.rating}
              </span>
            )}
            {seller.propertiesListed && (
              <span className="text-gray-500">{seller.propertiesListed} Properties</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600/10/50 p-4 rounded-xl mb-6 flex items-center gap-3">
        <ShieldCheck className="text-indigo-600 shrink-0" size={20} />
        <p className="text-xs text-indigo-600 leading-relaxed">
          This seller is verified by Nestify. Contact them securely without sharing your personal number immediately.
        </p>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-pink-600 hover:bg-pink-600/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#FF3F6C]/20">
          <Phone size={18} /> View Phone Number
        </button>
        <button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
          <MessageSquare size={18} /> Chat with Seller
        </button>
      </div>
    </div>
  );
}

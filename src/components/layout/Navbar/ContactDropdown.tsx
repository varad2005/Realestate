import { Phone, Mail, MessageCircle } from "lucide-react";

export function ContactDropdown() {

  return (
    <div className="relative group">
      {/* ICON */}
      <div className="p-2 rounded-full hover:bg-white/10 cursor-pointer transition">
        <Phone className="text-white w-5 h-5" />
      </div>

      {/* HOVER CARD */}
      <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 text-gray-900">
        
        <div className="p-4 space-y-4 text-sm">
          {/* Header */}
          <div>
            <h4 className="font-bold text-gray-900">Need Help?</h4>
            <p className="text-xs text-gray-500">We're available 9 AM - 8 PM</p>
          </div>

          <div className="space-y-3">
            <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-pink-600 transition-colors group/link">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover/link:bg-red-500/20 transition-colors">
                <Phone size={14} className="text-pink-600" />
              </div>
              <span className="font-medium">+91 98765 43210</span>
            </a>

            <a href="mailto:support@nestify.com" className="flex items-center gap-3 hover:text-pink-600 transition-colors group/link">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover/link:bg-red-500/20 transition-colors">
                <Mail size={14} className="text-pink-600" />
              </div>
              <span className="font-medium">support@nestify.com</span>
            </a>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button className="w-full bg-pink-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-pink-600/90 transition-all flex items-center justify-center gap-2">
              <Phone size={16} />
              Call Now
            </button>
            <button className="w-full bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2">
              <MessageCircle size={16} />
              WhatsApp Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

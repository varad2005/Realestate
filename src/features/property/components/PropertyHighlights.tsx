import { PropertyHighlight } from '@/types';
import { Sparkles } from 'lucide-react';

export function PropertyHighlights({ highlights }: { highlights: PropertyHighlight[] }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold font-['Poppins'] text-[#1A1A1A] mb-6 flex items-center gap-2">
        <Sparkles className="text-[#FF3F6C]" size={20} /> Property Highlights
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {highlights.map((hl, index) => (
          <div key={hl.id || index} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium mb-1 uppercase tracking-wide">{hl.title}</p>
            <p className="font-bold text-[#1A1A1A]">{hl.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

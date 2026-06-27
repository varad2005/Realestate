import { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { PropertyFilters, propertyService } from '@/services/propertyService';

interface AdvancedFiltersProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  onClear: () => void;
}

export function AdvancedFilters({ filters, setFilters, onClear }: AdvancedFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    bhk: true,
    propertyType: true,
  });

  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);

  useEffect(() => {
    propertyService.getFilterOptions().then(res => {
      if (res.amenities.length > 0) {
        setAvailableAmenities(res.amenities);
      } else {
        setAvailableAmenities(['Swimming Pool', 'Gym', 'Clubhouse', 'Security', 'Garden', 'Parking', 'Kids Play Area']);
      }
    });
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof PropertyFilters, value: any) => {
    const current = (filters[key] as any[]) || [];
    if (current.includes(value)) {
      updateFilter(key, current.filter(item => item !== value));
    } else {
      updateFilter(key, [...current, value]);
    }
  };

  const propertyTypes = ['Apartment', 'Villa', 'House', 'Builder Floor', 'Studio Apartment', 'Penthouse', 'Plot', 'Commercial Office'];
  const furnishingOptions = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished'];
  const possessionOptions = ['Ready to Move', 'Under Construction', 'Immediate'];
  const ownershipOptions = ['Freehold', 'Leasehold', 'Power of Attorney', 'Co-operative Society'];

  const SectionHeader = ({ title, section }: { title: string, section: string }) => (
    <div 
      className="flex items-center justify-between cursor-pointer py-2 group"
      onClick={() => toggleSection(section)}
    >
      <p className="text-[11px] font-bold text-gray-800 uppercase tracking-widest group-hover:text-[#FF3F6C] transition-colors">{title}</p>
      {openSections[section] ? <ChevronUp size={16} className="text-gray-400 group-hover:text-[#FF3F6C]" /> : <ChevronDown size={16} className="text-gray-400 group-hover:text-[#FF3F6C]" />}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-140px)] sticky top-28">
      <div className="flex items-center justify-between p-5 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gray-700" />
          <p className="font-bold text-[#1A1A1A] font-['Poppins']">Filters</p>
        </div>
        <button onClick={onClear} className="text-xs text-[#FF3F6C] font-bold hover:underline bg-[#FF3F6C]/10 px-3 py-1.5 rounded-lg">
          Clear All
        </button>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        {/* Price Range */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Price Range" section="price" />
          {openSections.price && (
            <div className="flex flex-col gap-3 mt-3">
              <input 
                type="number" 
                placeholder="Min Price (₹)" 
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="border border-gray-200 rounded-lg p-2.5 text-sm w-full outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
              />
              <input 
                type="number" 
                placeholder="Max Price (₹)" 
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="border border-gray-200 rounded-lg p-2.5 text-sm w-full outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C]"
              />
            </div>
          )}
        </div>

        {/* BHK */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="BHK Type" section="bhk" />
          {openSections.bhk && (
            <div className="flex flex-wrap gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6].map((bhk) => {
                const isSelected = (filters.bhk || []).includes(bhk);
                return (
                  <button
                    key={bhk}
                    onClick={() => toggleArrayFilter('bhk', bhk)}
                    className={`h-9 px-3 rounded-lg font-bold text-sm border transition-colors ${
                      isSelected 
                        ? 'bg-[#FF3F6C] text-white border-[#FF3F6C]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF3F6C] hover:text-[#FF3F6C]'
                    }`}
                  >
                    {bhk}{bhk === 6 ? '+' : ' BHK'}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Property Type" section="propertyType" />
          {openSections.propertyType && (
            <div className="space-y-2 mt-3">
              {propertyTypes.map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(filters.propertyType || []).includes(type.toLowerCase())}
                    onChange={() => toggleArrayFilter('propertyType', type.toLowerCase())}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Furnishing */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Furnishing" section="furnishing" />
          {openSections.furnishing && (
            <div className="space-y-2 mt-3">
              {furnishingOptions.map((f) => (
                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(filters.furnishing || []).includes(f)}
                    onChange={() => toggleArrayFilter('furnishing', f)}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{f}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Possession Status */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Possession Status" section="possession" />
          {openSections.possession && (
            <div className="space-y-2 mt-3">
              {possessionOptions.map((p) => (
                <label key={p} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(filters.possessionStatus || []).includes(p)}
                    onChange={() => toggleArrayFilter('possessionStatus', p)}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{p}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ownership */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Ownership" section="ownership" />
          {openSections.ownership && (
            <div className="space-y-2 mt-3">
              {ownershipOptions.map((o) => (
                <label key={o} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(filters.ownershipType || []).includes(o)}
                    onChange={() => toggleArrayFilter('ownershipType', o)}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{o}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Posted By */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Posted By" section="postedBy" />
          {openSections.postedBy && (
            <div className="space-y-2 mt-3">
              {['owner', 'dealer', 'builder'].map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer capitalize group">
                  <input 
                    type="checkbox" 
                    checked={(filters.postedByRole || []).includes(r)}
                    onChange={() => toggleArrayFilter('postedByRole', r)}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{r}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="border-b border-gray-50 pb-4">
          <SectionHeader title="Media Requirements" section="media" />
          {openSections.media && (
            <div className="space-y-2 mt-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.hasVideos || false}
                  onChange={(e) => updateFilter('hasVideos', e.target.checked ? true : undefined)}
                  className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Has Videos</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.hasImages || false}
                  onChange={(e) => updateFilter('hasImages', e.target.checked ? true : undefined)}
                  className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Has Images</span>
              </label>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="pb-4">
          <SectionHeader title="Amenities" section="amenities" />
          {openSections.amenities && (
            <div className="space-y-2 mt-3">
              {availableAmenities.map((a) => (
                <label key={a} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(filters.amenities || []).includes(a)}
                    onChange={() => toggleArrayFilter('amenities', a)}
                    className="accent-[#FF3F6C] w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{a}</span>
                </label>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

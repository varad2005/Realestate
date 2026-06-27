import { DetailedProperty } from '@/types';
import { MapPin, BedDouble, Maximize2, ShieldCheck, Tag } from 'lucide-react';

export function PropertyOverview({ property }: { property: DetailedProperty }) {
  return (
    <div className="space-y-8">
      {/* 1. Summary Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {property.badge && (
            <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} /> {property.badge}
            </span>
          )}
          {property.addonOrders && property.addonOrders.map((order: any) => order.addon && (
            <span key={order.id} className="bg-purple-500/10 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} /> {order.addon.name}
            </span>
          ))}
          <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
            {property.type}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black font-['Poppins'] text-[#1A1A1A] leading-tight mb-2">
          {property.title}
        </h1>
        {property.projectDetails?.marketingTagline && (
          <p className="text-lg text-[#FF3F6C] font-semibold italic mb-2">"{property.projectDetails.marketingTagline}"</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1"><MapPin size={16} /> {property.location}</span>
          <span>•</span>
          <span>{property.projectDetails?.projectName || "Independent Property"}</span>
        </div>
      </div>

      {/* 2. Price Block */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">Asking Price</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-black text-[#FF3F6C] font-['Poppins']">{property.price}</span>
            {property.area && property.priceNum && parseInt(String(property.area).replace(/\D/g, '')) > 0 && (
              <span className="text-sm font-medium text-gray-400">@ ₹{Math.round(property.priceNum / parseInt(String(property.area).replace(/\D/g, '')))}/sq.ft</span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[100px]">
            <BedDouble size={20} className="text-gray-400 mx-auto mb-1" />
            <p className="font-bold text-[#1A1A1A]">{property.bhk} BHK</p>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[100px]">
            <Maximize2 size={20} className="text-gray-400 mx-auto mb-1" />
            <p className="font-bold text-[#1A1A1A]">{property.area || 'N/A'}</p>
          </div>
          {property.carpetArea && (
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[100px]">
              <p className="text-xs text-gray-500 mb-1">Carpet Area</p>
              <p className="font-bold text-[#1A1A1A]">{property.carpetArea} sq.ft</p>
            </div>
          )}
          {property.builtUpArea && (
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm text-center min-w-[100px]">
              <p className="text-xs text-gray-500 mb-1">Built-up</p>
              <p className="font-bold text-[#1A1A1A]">{property.builtUpArea} sq.ft</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Key Highlights */}
      {property.highlights && property.highlights.length > 0 && (
        <div>
          <h3 className="text-lg font-bold font-['Poppins'] text-[#1A1A1A] mb-4">Key Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {property.highlights.map((hl: any, idx) => (
              <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <Tag size={14} className="text-amber-500" /> {typeof hl === 'string' ? hl : `${hl.title}${hl.value && hl.value !== 'Yes' ? `: ${hl.value}` : ''}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Information Grid */}
      <div>
        <h3 className="text-lg font-bold font-['Poppins'] text-[#1A1A1A] mb-4">Property Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Bedrooms" value={property.bhk ? String(property.bhk) : 'N/A'} />
          <InfoItem label="Bathrooms" value={property.bathrooms ? String(property.bathrooms) : 'N/A'} />
          <InfoItem label="Balconies" value={property.balconies ? String(property.balconies) : 'N/A'} />
          <InfoItem label="Floor" value={property.floor && property.totalFloors ? `${property.floor} of ${property.totalFloors}` : property.floor ? String(property.floor) : 'N/A'} />
          <InfoItem label="Furnishing" value={property.furnishing || 'N/A'} />
          <InfoItem label="Facing" value={property.facing || 'N/A'} />
          <InfoItem label="Property Age" value={property.propertyAge || 'N/A'} />
          <InfoItem label="Ownership" value={property.ownershipType || 'N/A'} />
          <InfoItem label="Possession" value={property.possession || 'N/A'} />
          {property.maintenanceCharges && <InfoItem label="Maintenance" value={`₹${property.maintenanceCharges}/month`} />}
        </div>
      </div>

      {/* 5. Description */}
      <div>
        <h3 className="text-lg font-bold font-['Poppins'] text-[#1A1A1A] mb-4">About Property</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {property.description}
        </p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-[#1A1A1A] text-sm truncate" title={value}>{value}</p>
    </div>
  );
}

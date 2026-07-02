import { MapPin, Star, Heart, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService, UIProperty } from '@/services/propertyService';
import { getPropertyImage } from '@/utils/propertyImages';
import { TourBadge } from '@/components/Property360/TourBadge';

export function VerBadge({ text, kind }: { text: string; kind: "verified" | "new" }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
        kind === "verified" ? "bg-emerald-500 text-white" : "bg-pink-600 text-white"
      }`}
    >
      {text}
    </span>
  );
}

export function WishBtn({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
    >
      <Heart
        size={14}
        className={active ? "fill-[#FF3F6C] text-pink-600" : "text-gray-500"}
      />
    </button>
  );
}

export function PropertyCard({
  property,
  onSelect,
  wishlisted = false,
  onWishlist = () => {},
}: {
  property: UIProperty;
  onSelect?: () => void;
  wishlisted?: boolean;
  onWishlist?: () => void;
}) {
  const navigate = useNavigate();
  
  // Directly use the image from UIProperty. Fallback is handled in propertyService.
  const imageUrl = property.image;

  return (
    <div
      onClick={onSelect || (() => navigate(`/property/${property.id}`))}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPropertyImage(property.id);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {property.status === 'approved' && (
            <VerBadge text="Verified" kind="verified" />
          )}
          {property.hasVirtualTour && (
            <TourBadge sceneCount={property.virtualToursCount || 1} />
          )}
          {property.videos && property.videos.length > 0 && (
             <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider bg-indigo-600/95 backdrop-blur-sm shadow-sm text-white uppercase">
               🎥 {property.videos.length} Video{property.videos.length > 1 ? 's' : ''}
             </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <WishBtn active={wishlisted} onToggle={onWishlist} />
        </div>
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {property.property_images && property.property_images.length > 0 && (
            <span className="flex items-center gap-1 bg-black/60 text-white text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-sm">
              <ImageIcon size={10} /> {property.property_images.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <p className="text-lg font-bold text-pink-600 font-['Poppins']">
            {property.price}
          </p>
          {(property.bhk || property.areaSqft) && (
            <span className="text-xs font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-200">
              {property.bhk ? `${property.bhk} BHK` : ''} 
              {property.bhk && property.areaSqft ? ' • ' : ''}
              {property.areaSqft ? `${property.areaSqft} sq.ft` : ''}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-1 leading-snug truncate">
          {property.title}
        </p>
        <div className="flex items-center gap-1 mt-1 mb-2 text-gray-500-foreground">
          <MapPin size={11} />
          <span className="text-xs truncate">{property.city}</span>
        </div>
        
        {/* Generated Role-Based Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
          {propertyService.generatePropertyDescription(property)}
        </p>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500-foreground">
          <span className="flex items-center gap-1 text-yellow-500 font-medium">
            <Star size={10} className="fill-warning/80" />
            4.5
          </span>
          <span>·</span>
          <span className="truncate max-w-[120px]">
            {property.postedByRole === 'dealer' ? 'Marketed by ' : 'By '}
            <span className="font-semibold text-gray-900">{property.ownerName}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

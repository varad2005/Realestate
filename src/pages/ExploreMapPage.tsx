import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { propertyService, UIProperty } from '@/services/propertyService';
import { PropertyCard } from '@/components/common/PropertyCard';
import { Search, SlidersHorizontal, Loader2, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Component to dynamically change map view
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export function ExploreMapPage() {
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState<string>('');
  
  // Map State
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 73.8567]); // Default Pune
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    // Fetch a large number of properties to populate the map
    const data = await propertyService.getAllProperties({
      query: searchQuery,
      propertyType: propertyType ? [propertyType] : undefined,
    }, 1, 100);
    
    // Set all properties for the sidebar
    setProperties(data);
    
    // Auto center to the first property with valid coordinates if no specific search
    const mapProps = data.filter(p => p.lat != null && p.lng != null);
    if (mapProps.length > 0 && !searchQuery) {
      setMapCenter([mapProps[0].lat!, mapProps[0].lng!]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [searchQuery, propertyType]);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Geocode via Nominatim
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
    
    fetchProperties();
  };

  const createPriceMarker = (price: string, isHovered: boolean, isSelected: boolean) => {
    let stateClass = '';
    if (isSelected) stateClass = 'selected';
    else if (isHovered) stateClass = 'hovered';

    return L.divIcon({
      className: '', // Remove leaflet's default classes
      html: `<div class="price-marker ${stateClass}">${price}</div>`,
      iconSize: [0, 0], // Handled by CSS
      iconAnchor: [0, 0], 
    });
  };

  return (
    <div className="flex flex-col h-screen pt-20 overflow-hidden bg-white">
      {/* Top Filter Bar */}
      <div className="flex-none h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white z-10 shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <input 
            type="text" 
            placeholder="Search by city, locality, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3F6C]/20 focus:border-pink-600"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <button type="submit" className="hidden">Search</button>
        </form>

        <div className="flex items-center gap-3">
          <select 
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:border-pink-600"
          >
            <option value="">All Properties</option>
            <option value="apartment">Apartments</option>
            <option value="villa">Villas</option>
            <option value="commercial">Commercial</option>
          </select>
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={14} /> More Filters
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Property List */}
        <div className="w-[45%] max-w-[600px] h-full overflow-y-auto bg-gray-50/50 p-6 hide-scrollbar flex flex-col relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">
              Homes around the Map
            </h1>
            <span className="text-sm font-medium text-gray-500 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
              {properties.length} Results
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-pink-600 mb-4" size={32} />
              <p className="text-gray-500 font-medium">Searching properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No properties found here</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">Try adjusting your filters or panning the map to a different area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(property => (
                <div 
                  key={property.id}
                  id={`card-${property.id}`}
                  onMouseEnter={() => setHoveredPropertyId(property.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  onClick={() => {
                    setSelectedPropertyId(property.id);
                    if (property.lat != null && property.lng != null) {
                      setMapCenter([property.lat, property.lng]);
                    } else {
                      toast.error("Location not available", {
                        description: "This property does not have valid map coordinates."
                      });
                    }
                  }}
                  className={`transition-all duration-300 rounded-2xl ${selectedPropertyId === property.id ? 'ring-2 ring-[#FF3F6C] ring-offset-2' : ''}`}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Area: Interactive Map */}
        <div className="flex-1 h-full relative z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={12} 
            scrollWheelZoom={true} 
            className="w-full h-full"
            zoomControl={false}
          >
            <MapUpdater center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {properties.filter(p => p.lat != null && p.lng != null).map(property => (
              <Marker
                key={property.id}
                position={[property.lat!, property.lng!]}
                zIndexOffset={selectedPropertyId === property.id ? 1000 : hoveredPropertyId === property.id ? 500 : 0}
                icon={createPriceMarker(
                  property.price.toString(),
                  hoveredPropertyId === property.id,
                  selectedPropertyId === property.id
                )}
                eventHandlers={{
                  click: () => {
                    setSelectedPropertyId(property.id);
                    // Scroll sidebar to this card
                    const card = document.getElementById(`card-${property.id}`);
                    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  },
                  mouseover: () => setHoveredPropertyId(property.id),
                  mouseout: () => setHoveredPropertyId(null)
                }}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div 
                    className="w-48 bg-white rounded-xl overflow-hidden cursor-pointer shadow-lg"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <img src={property.image} className="w-full h-32 object-cover" alt="Property" />
                    <div className="p-3">
                      <p className="text-pink-600 font-bold text-sm font-['Poppins']">{property.price}</p>
                      <p className="font-semibold text-xs text-gray-900 truncate mt-0.5">{property.title}</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin size={10} /> {property.locality || property.city}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

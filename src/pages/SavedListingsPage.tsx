import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { propertyService, UIProperty } from '@/services/propertyService';
import { Bookmark, MapPin, Eye, Heart } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function SavedListingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    setIsLoading(true);
    if (user) {
      const data = await propertyService.getSavedProperties(user.id);
      setProperties(data);
    }
    setIsLoading(false);
  };

  const handleUnsave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    
    // Optimistic update
    setProperties(prev => prev.filter(p => p.id !== id));
    await propertyService.unsaveProperty(user.id, id);
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-50/80 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50/80 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-500">Properties you have shortlisted for later.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            Total Saved: <span className="text-pink-600 font-bold">{properties.length}</span>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-pink-600/10 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark size={32} />
          </div>
          <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900 mb-2">No saved properties</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            You haven't saved any properties yet. Browse our listings and click the heart icon to save them here.
          </p>
          <button 
            onClick={() => navigate('/buy')}
            className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#FF3F6C]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => {
            const city = property.city || 'Unknown City';
            const price = property.price || 'Price on Request';
            const image = property.image || getPropertyImage(property.id);

            return (
              <div key={property.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* WISHLIST ICON */}
                  <button 
                    onClick={(e) => handleUnsave(e, property.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform text-pink-600"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                      property.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                      property.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {(property.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 font-['Poppins'] truncate">{property.title}</h3>
                    <div className="text-pink-600 font-bold whitespace-nowrap">{price}</div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
                    <MapPin size={16} />
                    {city}
                  </div>

                  <div className="grid grid-cols-1 gap-2 border-t border-gray-200 pt-4">
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-gray-900 hover:text-pink-600 hover:bg-pink-600/10 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

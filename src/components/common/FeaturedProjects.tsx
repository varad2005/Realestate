import { useState, useEffect, useCallback } from 'react';
import { Heart, User, LogOut, Home, Bookmark } from "lucide-react";
import { getPropertyImage } from '@/utils/propertyImages';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import { useRealtimeProperties } from '@/hooks/useRealtimeProperties';
import { propertyService, UIProperty } from '@/services/propertyService';


export function FeaturedProjects() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await propertyService.getAllPropertiesRaw({}, 1, 2);
      if (error) {
        setErrorMsg(JSON.stringify(error));
        setProperties([]);
      } else {
        const mapped = propertyService.mapProperties(data);
        setProperties(mapped);
      }
      
      if (user?.id) {
        const saved = await propertyService.getSavedProperties(user.id);
        setSavedPropertyIds(new Set(saved.map(p => p.id)));
      }
    } catch (err: any) {
      setErrorMsg(err.message || String(err));
      console.error("Failed to fetch featured properties", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const toggleSave = async (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    const isSaved = savedPropertyIds.has(propertyId);
    if (isSaved) {
      setSavedPropertyIds(prev => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
      await propertyService.unsaveProperty(user.id, propertyId);
    } else {
      setSavedPropertyIds(prev => new Set(prev).add(propertyId));
      await propertyService.saveProperty(user.id, propertyId);
    }
  };

  const handleRealtime = useCallback(() => {
    propertyService.getAllProperties({}, 1, 2).then(setProperties).catch(console.error);
  }, []);

  useRealtimeProperties(handleRealtime);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 mt-8">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900">
            Handpicked Projects
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Featured projects in Pune West
          </p>
        </div>
        <button 
          onClick={() => navigate('/buy')}
          className="text-pink-600 font-semibold text-sm hover:underline transition-all flex items-center gap-1 group"
        >
          View All 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARDS */}
        {isLoading ? (
          // Skeleton Loading
          <>
            <div className="animate-pulse bg-gray-50/80 rounded-xl h-64"></div>
            <div className="animate-pulse bg-gray-50/80 rounded-xl h-64"></div>
          </>
        ) : properties.length === 0 ? (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 p-8">
            <p className="text-gray-500 font-medium">No properties available</p>
            {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
          </div>
        ) : (
          properties.map((project: UIProperty) => {
            const loc = project.city || 'Location unavailable';
            const price = project.price || 'N/A';
            const image = project.image || getPropertyImage('1600596542815-ffad4c1539a9');

            return (
              <div 
                key={project.id} 
                onClick={() => navigate(`/property/${project.id}`)}
                className="relative group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-56 rounded-xl overflow-hidden shadow-sm bg-gray-50">
                  <img
                    src={image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* TOP TAG */}
                  <div className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    Featured
                  </div>
                  
                  {/* WISHLIST ICON */}
                  <button 
                    onClick={(e) => toggleSave(e, project.id)}
                    className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${savedPropertyIds.has(project.id) ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'}`}
                  >
                    <Heart size={14} fill={savedPropertyIds.has(project.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* OVERLAY CARD */}
                <div className="relative -mt-12 mx-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-900 font-['Poppins'] truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{loc}</p>
                  <p className="text-lg font-extrabold text-pink-600 mt-3 font-['Poppins']">
                    {price}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* RIGHT SIDEBAR (99acres feel) */}
        <div className="flex flex-col gap-6">
          {/* Card 1: User Panel */}
          {(!isAuthenticated || !user) ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center items-center text-center h-full">
              <div className="w-12 h-12 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-3">
                <User size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Guest User</h4>
              <p className="text-xs text-gray-500 mb-4">Login to save and access your shortlisted properties</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-pink-600/10 text-pink-600 font-semibold py-2 rounded-lg hover:bg-pink-600/20 transition-colors text-sm"
              >
                Login / Register
              </button>
            </div>
          ) : user.role !== 'admin' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center h-full">
              <div className="w-16 h-16 mb-3 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex-shrink-0">
                <img 
                  src={user.avatar_url || "https://i.pravatar.cc/150"} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-gray-900 text-center w-full truncate">{user.name}</h4>
              <p className="text-xs text-gray-500 mb-4 text-center w-full truncate">{user.email}</p>
              
              <div className="w-full space-y-2 mt-auto">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-2 bg-gray-50 text-gray-900 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <User size={16} className="text-gray-500" />
                  My Profile
                </button>
                
                {(user.role === 'owner' || user.role === 'dealer') && (
                  <button 
                    onClick={() => navigate('/my-listings')}
                    className="w-full flex items-center gap-2 bg-gray-50 text-gray-900 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Home size={16} className="text-gray-500" />
                    My Listings
                  </button>
                )}
                <button 
                  onClick={() => navigate('/saved-listings')}
                  className="w-full flex items-center gap-2 bg-gray-50 text-gray-900 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Bookmark size={16} className="text-gray-500" />
                  Saved Properties
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-pink-600 font-medium py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : null}

          {/* Card 2: Sell or rent faster */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/10 rounded-xl shadow-sm border border-secondary/20 p-5 flex flex-col justify-center items-center text-center h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h4 className="font-bold text-gray-900 mb-1 relative z-10">Sell or rent your property</h4>
            <p className="text-xs text-gray-500 mb-4 relative z-10">Get the best value for your property in minutes</p>
            <button 
              onClick={() => navigate('/post-property')}
              className="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-pink-600/90 transition-colors text-sm relative z-10"
            >
              Post Property Free
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

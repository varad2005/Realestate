import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types';
import { Building, MapPin, User as UserIcon, Mail, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (user && (user.role === 'owner' || user.role === 'dealer')) {
        try {
          const data = await propertyService.getPropertiesByOwner(user.id);
          setProperties(data);
        } catch (error) {
          console.error("Failed to fetch properties", error);
        }
      }
      setIsLoading(false);
    };

    fetchProperties();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F6] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-[#FF3F6C] to-pink-500"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-14">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>

            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-700">
                <Shield size={18} className="text-[#FF3F6C]" />
                <span className="font-medium capitalize">{user.role} Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Properties Section */}
        {(user.role === 'owner' || user.role === 'dealer') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="text-[#FF3F6C]" />
                My Properties
              </h2>
              <Link 
                to="/post-property" 
                className="px-4 py-2 bg-[#FF3F6C] text-white rounded-lg font-medium hover:bg-[#e62e5c] transition-colors"
              >
                Post New Property
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#FF3F6C]/20 border-t-[#FF3F6C] rounded-full animate-spin"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="aspect-video bg-gray-100 relative">
                       {/* Placeholder for property image if available, else a gray box */}
                       {property.image ? (
                          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Building size={32} />
                          </div>
                       )}
                       {property.badge && (
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900">
                           {property.badge}
                         </div>
                       )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                        <span className="font-bold text-[#FF3F6C]">{property.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin size={14} /> {property.location}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span>{property.bhk} BHK</span>
                        <span>•</span>
                        <span>{property.area}</span>
                        <span>•</span>
                        <span className="capitalize">{property.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Building size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  You haven't listed any properties. Start by posting your first property to reach thousands of buyers and tenants.
                </p>
                <Link 
                  to="/post-property" 
                  className="inline-flex px-6 py-3 bg-white text-[#FF3F6C] border border-[#FF3F6C] rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Post Property
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

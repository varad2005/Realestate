import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Building, MapPin, Edit, Trash2, Eye, PlusCircle } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';

export function MyListingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(url),
        property_videos(id),
        property_addon_orders(id, payment_status, order_status, addon:addon_services(name))
      `)
      .eq('owner_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProperties(data);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (!error) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = properties.filter(p => p.status === 'approved').length;
  const pendingCount = properties.filter(p => p.status === 'pending').length;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-500">Manage all the properties you have posted.</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            Total: <span className="text-[#FF3F6C] font-bold">{properties.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            Approved: <span className="text-green-600 font-bold">{approvedCount}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            Pending: <span className="text-orange-500 font-bold">{pendingCount}</span>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-[#FF3F6C]/10 text-[#FF3F6C] rounded-full flex items-center justify-center mx-auto mb-6">
            <Building size={32} />
          </div>
          <h2 className="text-2xl font-bold font-['Poppins'] text-gray-900 mb-2">You're yet to list any property</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Start posting your properties today to reach thousands of potential buyers and tenants.
          </p>
          <button 
            onClick={() => navigate('/post-property')}
            className="bg-[#FF3F6C] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#FF3F6C]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={20} />
            Post Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => {
            const city = property.city || 'Unknown City';
            const price = property.price ? Number(property.price).toLocaleString('en-IN') : 'Price on Request';
            const image = property.property_images?.[0]?.url || getPropertyImage(property.id);

            return (
              <div key={property.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                      property.status === 'approved' ? 'bg-green-100 text-green-700' :
                      property.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {property.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500 font-medium">Views: <span className="text-gray-900">0</span></span>
                      <span className="text-gray-500 font-medium">Media: <span className="text-gray-900">{(property.property_images?.length || 0) + (property.property_videos?.length || 0)}</span></span>
                    </div>
                    
                    {property.property_addon_orders && property.property_addon_orders.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {property.property_addon_orders.map((order: any) => order.addon && (
                          <span key={order.id} className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            {order.addon.name} ({order.order_status})
                          </span>
                        ))}
                      </div>
                    )}

                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 font-['Poppins'] truncate">{property.title}</h3>
                    <div className="text-[#FF3F6C] font-bold whitespace-nowrap">₹{price}</div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
                    <MapPin size={16} />
                    {city}
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                    <button 
                      onClick={() => navigate(`/property/${property.id}`)}
                      className="flex flex-col items-center justify-center gap-1 py-2 text-gray-500 hover:text-[#FF3F6C] hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">View</span>
                    </button>
                    <button 
                      onClick={() => navigate(`/post-property?edit=${property.id}`)}
                      className="flex flex-col items-center justify-center gap-1 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="flex flex-col items-center justify-center gap-1 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Delete</span>
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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Building, MapPin, Edit, Trash2, Eye, PlusCircle, Globe, Upload, Star, Loader2, X } from 'lucide-react';
import { getPropertyImage } from '@/utils/propertyImages';
import { virtualTourService } from '@/services/virtualTourService';
import { VirtualTour } from '@/types';

interface TourManagerState {
  propertyId: string | null;
  propertyTitle: string;
  scenes: VirtualTour[];
  loading: boolean;
  uploading: boolean;
}

export function MyListingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tour manager modal state
  const [tourManager, setTourManager] = useState<TourManagerState>({
    propertyId: null,
    propertyTitle: '',
    scenes: [],
    loading: false,
    uploading: false,
  });

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
        property_virtual_tours(id),
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
    
    // Clean up 360 virtual tours from storage first
    await virtualTourService.deleteAllScenesForProperty(id);

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (!error) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const openTourManager = async (propertyId: string, propertyTitle: string) => {
    setTourManager({ propertyId, propertyTitle, scenes: [], loading: true, uploading: false });
    const scenes = await virtualTourService.getToursByPropertyId(propertyId);
    setTourManager(prev => ({ ...prev, scenes, loading: false }));
  };

  const closeTourManager = () => {
    setTourManager({ propertyId: null, propertyTitle: '', scenes: [], loading: false, uploading: false });
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (!window.confirm('Delete this 360° scene? This cannot be undone.')) return;
    await virtualTourService.deleteScene(sceneId);
    setTourManager(prev => ({ ...prev, scenes: prev.scenes.filter(s => s.id !== sceneId) }));
    // Update property card tour count
    setProperties(prev => prev.map(p => {
      if (p.id === tourManager.propertyId) {
        return { ...p, property_virtual_tours: (p.property_virtual_tours || []).filter((t: any) => t.id !== sceneId) };
      }
      return p;
    }));
  };

  const handleSetDefault = async (sceneId: string) => {
    if (!tourManager.propertyId) return;
    await virtualTourService.setDefaultScene(sceneId, tourManager.propertyId);
    setTourManager(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => ({ ...s, is_default: s.id === sceneId })),
    }));
  };

  const handleTourUpload = async (file: File) => {
    if (!tourManager.propertyId || !user?.id) return;
    setTourManager(prev => ({ ...prev, uploading: true }));

    const { url, error } = await virtualTourService.uploadPanorama(file, user.id, tourManager.propertyId);
    if (url && !error) {
      const isFirstScene = tourManager.scenes.length === 0;
      const { data } = await virtualTourService.saveTourScene({
        propertyId: tourManager.propertyId,
        panoramaUrl: url,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        sortOrder: tourManager.scenes.length,
        isDefault: isFirstScene,
      });
      if (data) {
        setTourManager(prev => ({ ...prev, scenes: [...prev.scenes, data], uploading: false }));
        // Update property card
        setProperties(prev => prev.map(p => {
          if (p.id === tourManager.propertyId) {
            return { ...p, property_virtual_tours: [...(p.property_virtual_tours || []), { id: data.id }] };
          }
          return p;
        }));
      }
    } else {
      alert('Upload failed. Please try again.');
    }
    setTourManager(prev => ({ ...prev, uploading: false }));
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
            const tourCount = property.property_virtual_tours?.length || 0;

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
                    {tourCount > 0 && (
                      <span className="bg-violet-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Globe size={10} /> {tourCount} 360°
                      </span>
                    )}
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
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin size={16} />
                    {city}
                  </div>

                  {/* Manage 360° Tour button */}
                  <button
                    onClick={() => openTourManager(property.id, property.title)}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold mb-3 transition-all ${
                      tourCount > 0
                        ? 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-violet-600'
                    }`}
                  >
                    <Globe size={15} />
                    {tourCount > 0 ? `Manage 360° Tour (${tourCount} scene${tourCount > 1 ? 's' : ''})` : 'Add 360° Virtual Tour'}
                  </button>

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

      {/* Tour Manager Modal */}
      {tourManager.propertyId && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeTourManager}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Globe size={18} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-violet-600 uppercase tracking-wider">360° Virtual Tour</p>
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[220px]">{tourManager.propertyTitle}</p>
                </div>
              </div>
              <button onClick={closeTourManager} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {tourManager.loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <Loader2 size={28} className="animate-spin text-violet-500" />
                  <p className="text-sm text-gray-500">Loading tour scenes…</p>
                </div>
              ) : tourManager.scenes.length === 0 ? (
                <div className="text-center py-8 mb-4">
                  <Globe size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-2">No 360° scenes added yet.</p>
                  <p className="text-xs text-gray-400">Upload your first panorama below.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {tourManager.scenes.map((scene) => (
                    <div key={scene.id} className={`flex gap-3 items-center rounded-xl p-3 border ${scene.is_default ? 'border-violet-200 bg-violet-50/40' : 'border-gray-100'}`}>
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {scene.thumbnail_url ? (
                          <img src={scene.thumbnail_url} alt={scene.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-violet-100 flex items-center justify-center">
                            <Globe size={18} className="text-violet-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{scene.title}</p>
                        {scene.is_default && (
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!scene.is_default && (
                          <button
                            onClick={() => handleSetDefault(scene.id)}
                            title="Set as default"
                            className="w-7 h-7 rounded-full hover:bg-violet-100 text-gray-400 hover:text-violet-600 flex items-center justify-center transition-colors"
                          >
                            <Star size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteScene(scene.id)}
                          title="Delete scene"
                          className="w-7 h-7 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload new scene */}
              <div
                className="border-2 border-dashed border-violet-200 rounded-xl p-6 text-center cursor-pointer hover:bg-violet-50/30 transition-colors relative"
                onClick={() => document.getElementById('tour-manager-upload')?.click()}
              >
                {tourManager.uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-violet-500" />
                    <p className="text-sm font-medium text-violet-600">Uploading panorama…</p>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-violet-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-violet-700 mb-1">Add New 360° Scene</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP • Max 50 MB</p>
                  </>
                )}
                <input
                  id="tour-manager-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleTourUpload(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


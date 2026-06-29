import { useState, useEffect } from 'react';
import { Globe, Trash2, Eye, BarChart3, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { virtualTourService } from '@/services/virtualTourService';
import { Dynamic360Modal } from '@/components/Property360/Dynamic360Modal';
import { VirtualTour } from '@/types';

interface PropertyTourGroup {
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  propertyStatus: string;
  scenes: any[];
  lastAdded: string;
}

export function AdminVirtualToursPage() {
  const [tourGroups, setTourGroups] = useState<PropertyTourGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    tours: VirtualTour[];
    propertyName: string;
    propertyId: string;
  }>({ open: false, tours: [], propertyName: '', propertyId: '' });

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await virtualTourService.getAllPropertiesWithTours();

      // Group by property
      const groups: Record<string, PropertyTourGroup> = {};
      data.forEach((scene: any) => {
        const prop = scene.properties;
        if (!prop) return;

        if (!groups[prop.id]) {
          groups[prop.id] = {
            propertyId: prop.id,
            propertyTitle: prop.title || 'Untitled Property',
            propertyCity: prop.city || 'Unknown',
            propertyStatus: prop.status || 'unknown',
            scenes: [],
            lastAdded: scene.created_at,
          };
        }
        groups[prop.id].scenes.push(scene);

        // Keep track of latest scene
        if (new Date(scene.created_at) > new Date(groups[prop.id].lastAdded)) {
          groups[prop.id].lastAdded = scene.created_at;
        }
      });

      setTourGroups(Object.values(groups).sort(
        (a, b) => new Date(b.lastAdded).getTime() - new Date(a.lastAdded).getTime()
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to load virtual tours.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllScenes = async (group: PropertyTourGroup) => {
    if (!window.confirm(`Delete ALL ${group.scenes.length} scene(s) for "${group.propertyTitle}"? This cannot be undone.`)) return;

    for (const scene of group.scenes) {
      await virtualTourService.deleteScene(scene.id);
    }
    setTourGroups(prev => prev.filter(g => g.propertyId !== group.propertyId));
  };

  const handlePreview = async (group: PropertyTourGroup) => {
    const scenes = await virtualTourService.getToursByPropertyId(group.propertyId);
    setPreviewModal({
      open: true,
      tours: scenes,
      propertyName: group.propertyTitle,
      propertyId: group.propertyId,
    });
  };

  const totalScenes = tourGroups.reduce((sum, g) => sum + g.scenes.length, 0);
  const totalProperties = tourGroups.length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Poppins'] text-gray-900">360° Virtual Tours</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all 360° panoramic tours across the platform.</p>
        </div>
        <button
          onClick={loadTours}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
            <Globe size={22} className="text-violet-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{totalProperties}</p>
            <p className="text-sm text-gray-500 font-medium">Properties with Tours</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{totalScenes}</p>
            <p className="text-sm text-gray-500 font-medium">Total Panorama Scenes</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Globe size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">
              {totalProperties > 0 ? (totalScenes / totalProperties).toFixed(1) : '0'}
            </p>
            <p className="text-sm text-gray-500 font-medium">Avg. Scenes per Property</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Globe size={18} className="text-violet-500" />
          <h2 className="text-base font-bold text-gray-900">All Properties with Virtual Tours</h2>
          <span className="ml-auto text-xs text-gray-400 font-medium">
            {totalProperties} properties
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={32} className="animate-spin text-violet-500" />
            <p className="text-sm text-gray-500">Loading virtual tours…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button onClick={loadTours} className="text-xs text-violet-600 font-bold hover:underline">
              Retry
            </button>
          </div>
        ) : tourGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Globe size={40} className="text-gray-200" />
            <p className="text-sm font-medium">No virtual tours found.</p>
            <p className="text-xs text-gray-400">Upload 360° panoramas when posting properties.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Scenes</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Added</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tourGroups.map((group) => (
                  <tr key={group.propertyId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                          <Globe size={15} className="text-violet-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[200px]">
                            {group.propertyTitle}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{group.propertyCity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-violet-100 text-violet-700 font-bold text-sm rounded-full">
                        {group.scenes.length}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        group.propertyStatus === 'approved' ? 'bg-green-100 text-green-700' :
                        group.propertyStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {group.propertyStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {new Date(group.lastAdded).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(group)}
                          title="Preview virtual tour"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <Eye size={13} />
                          Preview
                        </button>
                        <button
                          onClick={() => window.open(`/property/${group.propertyId}`, '_blank')}
                          title="View property page"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <Globe size={13} />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteAllScenes(group)}
                          title="Delete all scenes"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <Trash2 size={13} />
                          Delete All
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dynamic360Modal
        isOpen={previewModal.open}
        onClose={() => setPreviewModal(prev => ({ ...prev, open: false }))}
        tours={previewModal.tours}
        propertyName={previewModal.propertyName}
        propertyId={previewModal.propertyId}
      />
    </div>
  );
}

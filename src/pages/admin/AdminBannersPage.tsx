import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Loader2 } from 'lucide-react';
import { HeroBanner, bannerService } from '@/services/bannerService';
import { BannerFormModal } from '@/components/admin/BannerFormModal';

export function AdminBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | undefined>();

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error('Failed to load banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerService.deleteBanner(id);
        loadBanners();
      } catch (error) {
        alert('Failed to delete banner');
      }
    }
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    try {
      await bannerService.updateBanner(banner.id, { is_active: !banner.is_active });
      loadBanners();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === banners.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const currentBanner = banners[index];
    const targetBanner = banners[newIndex];

    try {
      // Swap display_orders
      await Promise.all([
        bannerService.updateBanner(currentBanner.id, { display_order: targetBanner.display_order }),
        bannerService.updateBanner(targetBanner.id, { display_order: currentBanner.display_order })
      ]);
      loadBanners();
    } catch (error) {
      alert('Failed to reorder banners');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF3F6C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Poppins'] text-gray-900">Hero Banners</h1>
          <p className="text-gray-500 mt-1">Manage homepage slideshow banners</p>
        </div>
        <button
          onClick={() => { setEditingBanner(undefined); setIsModalOpen(true); }}
          className="bg-[#FF3F6C] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#e62e5c] transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Thumbnail</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Order</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-base font-medium text-gray-900">No banners found</p>
                    <p className="text-sm mt-1">Click "Add New Banner" to create one.</p>
                  </td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                          src={banner.image_url} 
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-gray-500 mt-0.5">{banner.subtitle}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          banner.is_active 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {banner.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <span className="w-6 text-center font-medium text-gray-700">{banner.display_order}</span>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === banners.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingBanner(banner); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <BannerFormModal
          banner={editingBanner}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            loadBanners();
          }}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Package, Loader2, Star } from 'lucide-react';
import { AddonService, addonService } from '@/services/addonService';
import { AddonFormModal } from '@/components/admin/AddonFormModal';

export function AdminAddonsPage() {
  const [addons, setAddons] = useState<AddonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonService | undefined>();

  const loadAddons = async () => {
    try {
      setLoading(true);
      const data = await addonService.getAllServices();
      setAddons(data);
    } catch (error) {
      console.error('Failed to load addons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddons();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Add-on Service?')) {
      try {
        await addonService.deleteService(id);
        loadAddons();
      } catch (error) {
        alert('Failed to delete Add-on');
      }
    }
  };

  const handleToggleActive = async (addon: AddonService) => {
    try {
      await addonService.updateService(addon.id, { is_active: !addon.is_active });
      loadAddons();
    } catch (error) {
      alert('Failed to update status');
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
          <h1 className="text-2xl font-bold font-['Poppins'] text-gray-900">Add-on Services</h1>
          <p className="text-gray-500 mt-1">Manage optional services available for purchase during property posting</p>
        </div>
        <button
          onClick={() => { setEditingAddon(undefined); setIsModalOpen(true); }}
          className="bg-[#FF3F6C] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#e62e5c] transition-colors flex items-center gap-2 shadow-md shadow-[#FF3F6C]/20"
        >
          <Plus size={18} /> Create Add-on
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {addons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-base font-medium text-gray-900">No Add-on Services found</p>
                    <p className="text-sm mt-1">Click "Create Add-on" to add your first service.</p>
                  </td>
                </tr>
              ) : (
                addons.map((addon) => (
                  <tr key={addon.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {addon.image_url ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img src={addon.image_url} alt={addon.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            {addon.name}
                            {addon.is_featured && <Star size={14} className="fill-[#FF3F6C] text-[#FF3F6C]" title="Featured" />}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{addon.short_description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {addon.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">₹{addon.base_price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">+{addon.tax_percentage}% GST</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(addon)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          addon.is_active 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {addon.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingAddon(addon); setIsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(addon.id)}
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
        <AddonFormModal
          addon={editingAddon}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false);
            loadAddons();
          }}
        />
      )}
    </div>
  );
}

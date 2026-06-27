import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { AddonService, addonService } from '@/services/addonService';

interface AddonFormModalProps {
  addon?: AddonService;
  onClose: () => void;
  onSave: () => void;
}

export function AddonFormModal({ addon, onClose, onSave }: AddonFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<AddonService>>({
    name: '',
    slug: '',
    short_description: '',
    detailed_description: '',
    category: 'Media',
    icon: '',
    image_url: '',
    base_price: 0,
    tax_percentage: 18,
    duration_days: undefined,
    display_order: 0,
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (addon) {
      setFormData(addon);
    }
  }, [addon]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await addonService.uploadAddonImage(file, file.name);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, name, slug: addon ? prev.slug : slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.short_description || formData.base_price === undefined) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      if (addon?.id) {
        await addonService.updateService(addon.id, formData);
      } else {
        await addonService.createService(formData);
      }
      onSave();
    } catch (error) {
      console.error(error);
      alert('Failed to save Add-on Service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold font-['Poppins']">
            {addon ? 'Edit Add-on Service' : 'Create New Add-on'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  placeholder="e.g. Professional Photography"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent bg-gray-50"
                  placeholder="e.g. professional-photography"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                >
                  <option value="Media">Media (Photos/Videos)</option>
                  <option value="Visibility">Visibility (Featured/Boost)</option>
                  <option value="Legal">Legal & Verification</option>
                  <option value="Consultation">Consultation & Management</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.short_description || ''}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent resize-none"
                  placeholder="Brief pitch for the service..."
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.base_price}
                    onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax (%) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={formData.tax_percentage}
                    onChange={e => setFormData({ ...formData, tax_percentage: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_days || ''}
                    onChange={e => setFormData({ ...formData, duration_days: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                    placeholder="e.g. 30 (Optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview (Optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                  {formData.image_url ? (
                    <div className="relative group rounded-lg overflow-hidden h-28">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                        <label className="cursor-pointer text-white font-medium bg-[#FF3F6C] px-4 py-2 rounded-lg text-sm">
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center h-28 text-gray-500">
                      <Upload size={24} className="mb-2 text-gray-400" />
                      <span className="text-sm">Click to upload image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description (Optional)</label>
              <textarea
                rows={3}
                value={formData.detailed_description || ''}
                onChange={e => setFormData({ ...formData, detailed_description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent resize-none"
                placeholder="Elaborate on the service..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#FF3F6C] rounded border-gray-300 focus:ring-[#FF3F6C]"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-[#FF3F6C] rounded border-gray-300 focus:ring-[#FF3F6C]"
                />
                <span className="text-sm font-medium text-gray-700">Featured (Highlight)</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2 rounded-xl bg-[#FF3F6C] text-white font-medium hover:bg-[#e62e5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading || uploading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Add-on'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

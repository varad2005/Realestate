import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { HeroBanner, bannerService } from '@/services/bannerService';

interface BannerFormModalProps {
  banner?: HeroBanner;
  onClose: () => void;
  onSave: () => void;
}

export function BannerFormModal({ banner, onClose, onSave }: BannerFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<HeroBanner>>({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    image_url: '',
    mobile_image_url: '',
    badge_text: '',
    overlay_opacity: 0.3,
    text_alignment: 'center',
    text_color: '#FFFFFF',
    is_active: true,
  });

  useEffect(() => {
    if (banner) {
      setFormData(banner);
    }
  }, [banner]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'mobile_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await bannerService.uploadBannerImage(file, file.name);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      alert('Title and Image are required');
      return;
    }

    try {
      setLoading(true);
      if (banner?.id) {
        await bannerService.updateBanner(banner.id, formData);
      } else {
        await bannerService.createBanner(formData);
      }
      onSave();
    } catch (error) {
      console.error(error);
      alert('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold font-['Poppins']">
            {banner ? 'Edit Banner' : 'Create New Banner'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  placeholder="e.g. Find Your Perfect Home"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  placeholder="e.g. 1,20,000+ Verified Listings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent resize-none"
                  placeholder="Short description under title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text || ''}
                    onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                    placeholder="e.g. View Projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link || ''}
                    onChange={e => setFormData({ ...formData, button_link: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                    placeholder="e.g. /projects"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desktop Image *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                  {formData.image_url ? (
                    <div className="relative group rounded-lg overflow-hidden h-32">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                        <label className="cursor-pointer text-white font-medium bg-[#FF3F6C] px-4 py-2 rounded-lg text-sm">
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'image_url')} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center h-32 text-gray-500">
                      <Upload size={24} className="mb-2 text-gray-400" />
                      <span className="text-sm">Click to upload image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'image_url')} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                  {formData.mobile_image_url ? (
                    <div className="relative group rounded-lg overflow-hidden h-32">
                      <img src={formData.mobile_image_url} alt="Mobile Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                        <label className="cursor-pointer text-white font-medium bg-[#FF3F6C] px-4 py-2 rounded-lg text-sm">
                          Change
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'mobile_image_url')} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center h-32 text-gray-500">
                      <Upload size={24} className="mb-2 text-gray-400" />
                      <span className="text-sm">Click to upload mobile image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'mobile_image_url')} />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity (0-1)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.overlay_opacity}
                    onChange={e => setFormData({ ...formData, overlay_opacity: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                  <select
                    value={formData.text_alignment}
                    onChange={e => setFormData({ ...formData, text_alignment: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-[#FF3F6C] rounded border-gray-300 focus:ring-[#FF3F6C]"
              />
              <span className="text-sm font-medium text-gray-700">Active (Visible on site)</span>
            </label>

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
                {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Banner'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

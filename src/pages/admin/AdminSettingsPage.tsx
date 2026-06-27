import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Save } from 'lucide-react';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: '',
    contact_email: '',
    maintenance_mode: false,
    allow_registrations: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    async function loadSettings() {
      const { settings: data, error } = await adminService.getSettings();
      if (!error && data) {
        setSettings({
          site_name: data.site_name || 'Nestify',
          contact_email: data.contact_email || 'admin@nestify.com',
          maintenance_mode: !!data.maintenance_mode,
          allow_registrations: data.allow_registrations !== false
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    const { error } = await adminService.updateSettings(settings);
    if (error) {
      setMessage({ text: 'Failed to save settings.', type: 'error' });
    } else {
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-8 text-gray-500 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-8">Site Settings</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input 
                type="text" 
                value={settings.site_name}
                onChange={e => setSettings({...settings, site_name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#FF3F6C] focus:border-[#FF3F6C] block p-3 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                value={settings.contact_email}
                onChange={e => setSettings({...settings, contact_email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-[#FF3F6C] focus:border-[#FF3F6C] block p-3 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Access</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-semibold text-gray-900">Allow New Registrations</div>
                <div className="text-sm text-gray-500">Enable or disable new users from signing up.</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.allow_registrations}
                onChange={e => setSettings({...settings, allow_registrations: e.target.checked})}
                className="w-5 h-5 text-[#FF3F6C] rounded border-gray-300 focus:ring-[#FF3F6C]"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl cursor-pointer hover:bg-red-50/50 transition-colors">
              <div>
                <div className="font-semibold text-red-900">Maintenance Mode</div>
                <div className="text-sm text-red-700/70">Put the site offline for all non-admin users.</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.maintenance_mode}
                onChange={e => setSettings({...settings, maintenance_mode: e.target.checked})}
                className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-600"
              />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FF3F6C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#E63560] transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

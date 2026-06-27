import { PlusCircle, UserPlus, Download, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="font-bold text-gray-900 font-['Poppins'] mb-6">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => navigate('/post-property')}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#FF3F6C]/30 hover:bg-[#FF3F6C]/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF3F6C]/10 text-[#FF3F6C] flex items-center justify-center">
              <PlusCircle size={20} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-[#FF3F6C] transition-colors">Add New Property</span>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-[#FF3F6C]" />
        </button>

        <button 
          onClick={() => navigate('/admin/users')}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500/30 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Add New User</span>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600" />
        </button>

        <button 
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-500/30 hover:bg-green-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Download size={20} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">Export Reports</span>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-green-600" />
        </button>

        <button 
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-500/30 hover:bg-purple-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Settings size={20} />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">Site Settings</span>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-600" />
        </button>
      </div>
    </div>
  );
}

import { PlusCircle, UserPlus, Download, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
      <h3 className="font-bold text-gray-900 font-['Poppins'] mb-6">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => navigate('/post-property')}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-pink-600/30 hover:bg-pink-600/5 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-600/10 text-pink-600 flex items-center justify-center">
              <PlusCircle size={20} />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">Add New Property</span>
          </div>
          <ChevronRight size={20} className="text-gray-500/50 group-hover:text-pink-600" />
        </button>

        <button 
          onClick={() => navigate('/admin/users')}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-secondary/30 hover:bg-indigo-600/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Add New User</span>
          </div>
          <ChevronRight size={20} className="text-gray-500/50 group-hover:text-indigo-600" />
        </button>

        <button 
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-success/30 hover:bg-emerald-500/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Download size={20} />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-emerald-500 transition-colors">Export Reports</span>
          </div>
          <ChevronRight size={20} className="text-gray-500/50 group-hover:text-emerald-500" />
        </button>

        <button 
          className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-accent/30 hover:bg-purple-600/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-600 flex items-center justify-center">
              <Settings size={20} />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Site Settings</span>
          </div>
          <ChevronRight size={20} className="text-gray-500/50 group-hover:text-purple-600" />
        </button>
      </div>
    </div>
  );
}

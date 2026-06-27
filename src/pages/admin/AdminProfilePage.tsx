import { useAuth } from '@/context/AuthContext';
import { Mail, User as UserIcon, Shield, Calendar, Edit3, Camera } from 'lucide-react';
import { format } from 'date-fns';

export function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-8">Admin Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-[#FF3F6C] to-purple-500 relative">
          <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Camera size={16} />
            Change Cover
          </button>
        </div>

        {/* Profile Info Area */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative group">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              <Edit3 size={16} />
              Edit Profile
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">{user?.name || 'Admin User'}</h2>
              <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                <Shield size={16} className="text-[#FF3F6C]" />
                System Administrator
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <UserIcon size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Full Name</div>
                  <div className="text-gray-900 font-semibold">{user?.name || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-pink-50 text-[#FF3F6C] flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Email Address</div>
                  <div className="text-gray-900 font-semibold">{user?.email || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Role Permissions</div>
                  <div className="text-gray-900 font-semibold capitalize">{user?.role || 'Admin'}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Member Since</div>
                  <div className="text-gray-900 font-semibold">
                    {user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'Recently'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Home, Users, BarChart3, MessageSquare, Settings, Activity, Bell, LogOut, Hexagon, UserCircle, Image, ShoppingCart, PlusCircle, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F6] flex flex-col">
      {/* TOP NAVIGATION */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-[#FF3F6C] cursor-pointer" onClick={() => navigate('/')}>
          <Hexagon fill="currentColor" size={28} />
          <span className="text-xl font-bold font-['Poppins'] text-gray-900 tracking-tight">Nestify</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-700 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div 
              onClick={() => navigate('/admin/profile')}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FF3F6C] transition-all"
            >
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block text-sm">
              <p 
                onClick={() => navigate('/admin/profile')}
                className="font-semibold text-gray-900 leading-none cursor-pointer hover:text-[#FF3F6C] transition-colors"
              >
                {user?.name || 'Admin'}
              </p>
              <button onClick={handleLogout} className="text-gray-500 hover:text-[#FF3F6C] text-xs mt-1 flex items-center gap-1 transition-colors">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 flex items-center gap-2">
              <ShieldAlert size={14} className="text-[#FF3F6C]" /> Admin Panel
            </h3>
            
            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/admin/properties"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Home size={18} />
                Properties
              </NavLink>
              
              <NavLink
                to="/admin/users"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Users size={18} />
                Users
              </NavLink>
              
              <NavLink
                to="/admin/banners"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Image size={18} />
                Banners
              </NavLink>
              
              <NavLink
                to="/admin/addons"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <PlusCircle size={18} />
                Add-on Services
              </NavLink>

              <NavLink
                to="/admin/addon-orders"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <ShoppingCart size={18} />
                Add-on Orders
              </NavLink>
              
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <BarChart3 size={18} />
                Reports
              </NavLink>

              <NavLink
                to="/admin/virtual-tours"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Globe size={18} />
                360° Tours
              </NavLink>

              
              <NavLink
                to="/admin/reviews"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <MessageSquare size={18} />
                Reviews
              </NavLink>
              
              <div className="pt-4 mt-4 border-t border-gray-100"></div>
              
              <NavLink
                to="/admin/settings"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Settings size={18} />
                Site Settings
              </NavLink>

              <NavLink
                to="/admin/activity"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Activity size={18} />
                Activity Logs
              </NavLink>

              <NavLink
                to="/admin/profile"
                className={({ isActive }) => 
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#FF3F6C]/10 text-[#FF3F6C]' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <UserCircle size={18} />
                My Profile
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

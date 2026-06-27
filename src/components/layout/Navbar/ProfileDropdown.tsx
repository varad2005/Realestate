import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLinkClass = "block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-gray-50 hover:text-[#FF3F6C] transition-colors rounded-lg font-medium";

  if (!isAuthenticated || !user) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="flex items-center justify-center hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer text-white"
      >
        <User size={20} />
      </button>
    );
  }

  // Admin should NEVER see this navbar
  if (user.role === 'admin') {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
      >
        <img 
          src={user.avatar_url || "https://i.pravatar.cc/150"} 
          alt="Profile"
          className="w-8 h-8 rounded-full border border-white/20 object-cover"
        />
      </button>

      <div 
        className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all duration-200 transform ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-100 mb-2">
          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
        </div>

        <NavLink to="/profile" onClick={() => setIsOpen(false)} className={getLinkClass}>
          My Profile
        </NavLink>
        <NavLink to="/my-listings" onClick={() => setIsOpen(false)} className={getLinkClass}>
          My Listings
        </NavLink>
        <NavLink to="/saved-listings" onClick={() => setIsOpen(false)} className={getLinkClass}>
          Saved Listings
        </NavLink>
        
        <div className="my-1 border-t border-gray-100"></div>
        <button 
          onClick={handleLogout} 
          className="w-full text-left block px-4 py-2 text-sm text-[#FF3F6C] hover:bg-red-50 transition-colors rounded-lg font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

import { Building, ChevronDown, Heart } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ProfileDropdown } from './ProfileDropdown';
import { ContactDropdown } from './ContactDropdown';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  label: string;
  path: string;
  showOn: ('landing' | 'dashboard' | 'post-property')[];
  badge?: string;
  dropdown?: { label: string; path: string }[];
};

const navItems: NavItem[] = [
  { 
    label: "Buy in Pune", 
    path: "/buy", 
    showOn: ["landing", "dashboard", "post-property"],
    dropdown: [
      { label: "Pune", path: "/buy/pune" },
      { label: "Mumbai", path: "/buy/mumbai" },
      { label: "Bangalore", path: "/buy/bangalore" },
      { label: "Hyderabad", path: "/buy/hyderabad" },
    ]
  },
  { 
    label: "For Buyers", 
    path: "/buyers", 
    showOn: ["landing", "dashboard", "post-property"],
    dropdown: [
      { label: "Buy a Home", path: "/buy" },
      { label: "Land / Plot", path: "/plots" },
      { label: "Commercial", path: "/commercial" },
      { label: "New Projects", path: "/projects" },
      { label: "Popular Areas", path: "/popular-areas" },
      { label: "Luxury Homes", path: "/luxury-homes" },
      { label: "Budget Homes", path: "/budget-homes" },
      { label: "Ready to Move", path: "/ready-to-move" },
    ]
  },
  { 
    label: "For Tenants", 
    path: "/tenants", 
    showOn: ["landing", "dashboard", "post-property"],
    dropdown: [
      { label: "Rent a Home", path: "/rent" },
      { label: "PG / Co-Living", path: "/rent?type=pg" },
      { label: "Commercial", path: "/commercial" },
      { label: "Popular Areas", path: "/popular-areas" },
    ]
  },
  { 
    label: "For Owners", 
    path: "/owners", 
    showOn: ["dashboard", "post-property"] 
  },
  { 
    label: "For Dealers / Builders", 
    path: "/dealers", 
    showOn: ["dashboard", "post-property"] 
  },
  { 
    label: "Insights", 
    path: "/insights", 
    showOn: ["landing", "dashboard", "post-property"], 
    badge: "NEW" 
  },
  {
    label: "🗺 Explore on Map",
    path: "/explore-map",
    showOn: ["landing", "dashboard", "post-property"]
  },
];

export function Navbar({ wishlistCount }: { wishlistCount?: number }) {
  const location = useLocation();
  const { user } = useAuth();

  const getEnv = () => {
    if (location.pathname.startsWith('/admin')) return 'dashboard';
    if (location.pathname.startsWith('/post-property')) return 'post-property';
    return 'landing';
  };

  const currentEnv = getEnv();
  const visibleItems = navItems.filter(item => item.showOn.includes(currentEnv));

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 text-sm transition-colors cursor-pointer py-2 group hover:text-white hover:underline ${
      isActive ? 'text-white font-semibold underline' : 'text-white/90'
    }`;

  const getDropdownItemClass = (path: string) => {
    const isActive = location.pathname + location.search === path;
    return `text-left px-4 py-2.5 rounded-lg text-sm transition-colors block ${
      isActive ? 'bg-gray-50 text-pink-600 font-bold' : 'hover:bg-gray-50 text-gray-900 font-medium'
    }`;
  };

  return (
    <nav className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm text-white px-6 md:px-10 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* LEFT: Logo */}
        <div className="flex shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF3F6C]/20">
              <Building size={17} className="text-white" />
            </div>
            <span className="text-2xl font-bold font-['Poppins'] tracking-tight text-white drop-shadow-md">
              Nestify
            </span>
          </Link>
        </div>

        {/* CENTER: Config-Driven Navigation Menu */}
        <div className="hidden lg:flex items-center gap-8 tracking-wide">
          {visibleItems.map((item, index) => (
            <div key={index} className="relative group cursor-pointer">
              {item.dropdown ? (
                // Dropdown Item
                <>
                  <div className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors py-2">
                    {item.label} <ChevronDown size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-2 w-64 border border-gray-200 grid grid-cols-1 gap-1">
                      {item.dropdown.map((dropItem, idx) => (
                        <NavLink to={dropItem.path} key={idx} className={() => getDropdownItemClass(dropItem.path)}>
                          {dropItem.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Simple Link
                <NavLink to={item.path} className={getLinkClass}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-pink-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </div>
          ))}
          {(user?.role === 'owner' || user?.role === 'dealer') && (
            <div className="relative group cursor-pointer">
              <NavLink to="/my-listings" className={getLinkClass}>
                <span>My Listings</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex justify-end items-center gap-3 md:gap-5 shrink-0">
          <Link to="/saved-listings" className="relative hover:text-pink-600 transition-colors p-2 hidden sm:block">
            <Heart size={20} className="text-white/90" />
            {wishlistCount !== undefined && wishlistCount > 0 && (
              <span className="absolute top-1 right-0 w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:block">
            <ProfileDropdown />
          </div>
          <div className="hidden sm:block">
            <ContactDropdown />
          </div>

          <Link 
            to="/post-property" 
            className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-[#FF3F6C]/20 hover:bg-pink-600/90 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Post Property
            <span className="hidden xl:inline bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Free</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

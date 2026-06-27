import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export function MainLayout() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const toggleWishlist = (id: string) =>
    setWishlist((prev: string[]) =>
      prev.includes(id) ? prev.filter((x: string) => x !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen bg-[#F5F5F6] text-[#1A1A1A] font-sans selection:bg-[#FF3F6C]/20 selection:text-[#FF3F6C] flex flex-col">
      <Navbar wishlistCount={wishlist.length} />
      <div className="relative flex-1">
        <Outlet context={{ wishlist, toggleWishlist }} />
      </div>
      <Footer />
    </div>
  );
}

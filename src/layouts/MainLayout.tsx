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
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-pink-600/20 selection:text-pink-600 flex flex-col">
      <Navbar wishlistCount={wishlist.length} />
      <div className="relative flex-1">
        <Outlet context={{ wishlist, toggleWishlist }} />
      </div>
      <Footer />
    </div>
  );
}

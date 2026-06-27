import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  role?: 'admin' | 'owner' | 'dealer' | ('owner' | 'dealer')[];
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F6]">
        <div className="w-10 h-10 border-4 border-[#FF3F6C]/20 border-t-[#FF3F6C] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // If the route explicitly required admin, we redirect to "/" to hide admin login completely.
    // Otherwise, normal protected routes go to "/login"
    if (role === 'admin') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role) {
    if (Array.isArray(role)) {
      if (!role.includes(user.role as any)) {
        return <Navigate to="/" replace />;
      }
    } else if (user.role !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

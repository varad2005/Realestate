import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<{ error: Error | null, user?: any, userData?: any }>;
  signUp: (name: string, email: string, password: string, role: 'owner' | 'dealer' | 'builder' | 'admin') => Promise<{ error: Error | null, user?: any, userData?: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session, error: sessionError } = await authService.getCurrentSession();
        if (sessionError) console.error('Session error:', sessionError);
        if (!session) {
          setUser(null);
        } else if (session?.user) {
          const { userData, error: profileError } = await authService.getUserProfile(session.user.id);
          if (profileError) console.error('Profile error:', profileError);
          if (userData) {
            setUser(userData);
          } else {
            setUser(null); // Ensure no fake user is created if profile is missing
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) return { error: new Error("Password is required") };
    
    const res = await authService.login(email, password);
    if (res.error) {
      return { error: res.error };
    }
    
    if (res.user && res.userData) {
      setUser(res.userData);
      return { error: null, user: res.user, userData: res.userData };
    }
    return { error: new Error("Login failed") };
  };

  const signUp = async (name: string, email: string, password: string, role: 'owner' | 'dealer' | 'builder' | 'admin') => {
    const res = await authService.signUp(name, email, password, role);
    if (res.error) {
      return { error: res.error };
    }
    
    if (res.user && res.userData) {
      setUser(res.userData);
      return { error: null, user: res.user, userData: res.userData };
    }
    return { error: new Error("Signup failed") };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.clear();
    console.log("LOGOUT SUCCESS");
    console.log("CURRENT USER:", null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isAuthenticated: !!user, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

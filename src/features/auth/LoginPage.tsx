import { Building, ArrowRight, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'dealer' | 'admin'>('owner');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let res;

      if (isLoginMode) {
        res = await login(email, password);
      } else {
        res = await signUp(name, email, password, role);
      }

      if (!res.user) {
        console.error("Auth Error:", res.error);
        setError(res.error?.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      
      const userRole = res.userData?.role;

      if (!userRole) {
        setError("User role not found.");
        setIsLoading(false);
        return;
      }

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building size={20} className="text-white" />
          </div>
          <span className="text-3xl font-bold font-['Poppins'] tracking-tight text-gray-900">
            Nestify
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-['Poppins']">
          {isLoginMode ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {isLoginMode ? 'Sign in to access your saved properties and profile.' : 'Join us to buy, sell, or rent properties.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50">
          <form className="space-y-6" onSubmit={handleAuth}>
            
            {!isLoginMode && (
              <>
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF3F6C] focus:border-pink-600 sm:text-sm transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    I am a...
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="owner"
                        checked={role === 'owner'}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="text-pink-600 focus:ring-[#FF3F6C]"
                      />
                      <span className="text-sm text-gray-900">Owner / Buyer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="dealer"
                        checked={role === 'dealer'}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="text-pink-600 focus:ring-[#FF3F6C]"
                      />
                      <span className="text-sm text-gray-900">Dealer / Builder</span>
                    </label>
                    {/* Only show admin if needed, or hide it in production. Let's include it for demo purposes */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="text-pink-600 focus:ring-[#FF3F6C]"
                      />
                      <span className="text-sm text-gray-900">Admin</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF3F6C] focus:border-pink-600 sm:text-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF3F6C] focus:border-pink-600 sm:text-sm transition-all pr-10"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLoginMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 focus:ring-[#FF3F6C] border-gray-200 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-pink-600 hover:text-[#e62e5c] transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-pink-600 hover:bg-pink-600/90 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[#FF3F6C]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF3F6C] transition-all"
              >
                {isLoading ? (isLoginMode ? 'Signing in...' : 'Signing up...') : (isLoginMode ? 'Sign in' : 'Sign up')}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  <span className="ml-2">Google</span>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-[#1877F2] hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="font-bold text-pink-600 hover:text-[#e62e5c] transition-colors"
          >
            {isLoginMode ? 'Sign up now' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

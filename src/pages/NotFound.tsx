import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-10 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-900 font-['Poppins'] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-pink-600/90 transition-all">
        Go Back Home
      </Link>
    </div>
  );
}

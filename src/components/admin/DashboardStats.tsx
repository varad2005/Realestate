import { Users, Home, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalProperties: number;
    pendingProperties: number;
    approvedProperties: number;
    recentProperties: any[];
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Poppins']">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/10 rounded-full flex items-center justify-center">
            <Users className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center">
            <Home className="text-gray-500" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Properties</p>
            <p className="text-3xl font-bold">{stats.totalProperties}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="text-emerald-500" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-bold text-emerald-500">{stats.approvedProperties}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingProperties}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold font-['Poppins'] mb-4 flex items-center gap-2">
          <Clock className="text-gray-500" size={20} />
          Recent Activity
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {stats.recentProperties.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent properties</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentProperties.map((prop) => (
                <div key={prop.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900">{prop.title}</h3>
                    <p className="text-sm text-gray-500">
                      Added by {prop.owner?.name || 'Unknown'} • {prop.price_num ? `₹${Number(prop.price_num).toLocaleString('en-IN')}` : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    prop.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' : 
                    prop.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {prop.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

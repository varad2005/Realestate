import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Download } from 'lucide-react';

export function AdminReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const res = await adminService.getDashboardData();
      setData(res);
      setIsLoading(false);
    }
    loadReports();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-gray-500 animate-pulse">Loading reports...</div>;
  }

  const { stats, lineChartData, donutChartData } = data;

  // Transform donut data for bar chart
  const barChartData = donutChartData.map((d: any) => ({
    city: d.name,
    properties: d.value
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed breakdown of platform performance.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Properties</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalProperties}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Approval Rate</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalProperties ? Math.round((stats.approvedProperties / stats.totalProperties) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-gray-900">{stats.pendingProperties}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
          <h3 className="font-bold text-gray-900 font-['Poppins'] mb-6">Property Submission Trends (Last 7 Days)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="Approved" stroke="#10b981" strokeWidth={3} />
                <Line type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={3} />
                <Line type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
          <h3 className="font-bold text-gray-900 font-['Poppins'] mb-6">Properties by City (Top 5)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="properties" fill="#FF3F6C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

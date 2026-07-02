import { useAdminStats } from '@/hooks/useAdminStats';
import { StatCard } from '@/components/admin/StatCard';
import { PropertyOverviewChart, CityDistributionChart } from '@/components/admin/Charts';
import { ActivityPanel } from '@/components/admin/ActivityPanel';
import { QuickActions } from '@/components/admin/QuickActions';
import { Users, Home, ShieldAlert, CheckCircle } from 'lucide-react';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { adminService } from '@/services/adminService';
import { useState } from 'react';
import { useRealtimeProperties } from '@/hooks/useRealtimeProperties';

export function Dashboard() {
  const { data, isLoading, error, refetch } = useAdminStats();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useRealtimeProperties(refetch);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setActionLoadingId(id);
    await adminService.updatePropertyStatus(id, status);
    await refetch();
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    await adminService.deleteProperty(id);
    await refetch();
    setActionLoadingId(null);
  };

  if (isLoading) {
    return <div className="p-8 text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-500/10 border border-destructive/40 rounded-xl text-red-500">
          {error || 'Failed to load data.'}
        </div>
      </div>
    );
  }

  const { stats, lineChartData, donutChartData, recentActivity, recentProperties } = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900">Welcome back, Admin 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your platform today.</p>
      </div>
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          trend={stats.usersTrend} 
        />
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          icon={<Home size={24} />} 
          trend={stats.propertiesTrend} 
        />
        <StatCard 
          title="Approved" 
          value={stats.approvedProperties} 
          icon={<CheckCircle size={24} />} 
          trend={stats.approvedTrend} 
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingProperties} 
          icon={<ShieldAlert size={24} />} 
          trend={stats.pendingTrend} 
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PropertyOverviewChart data={lineChartData} />
        </div>
        <div className="lg:col-span-1">
          <CityDistributionChart data={donutChartData} total={stats.totalProperties} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-gray-900 font-['Poppins'] text-xl">Recent Properties</h3>
            <button className="text-pink-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <PropertyTable 
            properties={recentProperties}
            isLoading={false}
            actionLoadingId={actionLoadingId}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
          />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <ActivityPanel activities={recentActivity} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

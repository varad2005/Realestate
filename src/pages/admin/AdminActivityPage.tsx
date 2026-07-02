import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { CheckCircle, XCircle, Home, UserPlus } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      const { logs: data } = await adminService.getActivityLogs();
      setLogs(data || []);
      setIsLoading(false);
    }
    loadActivity();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'property_approved': return <CheckCircle size={18} className="text-emerald-500" />;
      case 'property_rejected': return <XCircle size={18} className="text-red-500" />;
      case 'property_submitted': return <Home size={18} className="text-yellow-500" />;
      case 'user_registered': return <UserPlus size={18} className="text-indigo-600" />;
      default: return <CheckCircle size={18} className="text-gray-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'property_approved': return 'bg-emerald-500/10';
      case 'property_rejected': return 'bg-red-500/10';
      case 'property_submitted': return 'bg-yellow-500/10';
      case 'user_registered': return 'bg-indigo-600/10';
      default: return 'bg-gray-50';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-gray-500 animate-pulse">Loading activity logs...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-8">Activity Logs</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activity found.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start pb-6 border-b border-gray-300/10 last:border-0 last:pb-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBg(log.type)}`}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-gray-900">{log.title}</p>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{log.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

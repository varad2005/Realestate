import { CheckCircle, XCircle, Home, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityPanelProps {
  activities: any[];
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'property_approved': return <CheckCircle size={18} className="text-green-500" />;
      case 'property_rejected': return <XCircle size={18} className="text-red-500" />;
      case 'property_submitted': return <Home size={18} className="text-orange-500" />;
      case 'user_registered': return <UserPlus size={18} className="text-blue-500" />;
      default: return <CheckCircle size={18} className="text-gray-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'property_approved': return 'bg-green-50';
      case 'property_rejected': return 'bg-red-50';
      case 'property_submitted': return 'bg-orange-50';
      case 'user_registered': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 font-['Poppins']">Recent Activity</h3>
        <button className="text-[#FF3F6C] text-sm font-semibold hover:underline">View All</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBg(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500 truncate">{activity.subtitle}</p>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

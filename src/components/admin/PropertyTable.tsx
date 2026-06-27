import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPropertyImage } from '@/utils/propertyImages';

interface PropertyTableProps {
  properties: any[];
  isLoading: boolean;
  actionLoadingId: string | null;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  onDelete: (id: string) => void;
}

export function PropertyTable({ properties, isLoading, actionLoadingId, onUpdateStatus, onDelete }: PropertyTableProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredProperties = properties.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter || (!p.status && filter === 'pending');
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center bg-transparent mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <Filter size={14} />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-transparent border-none outline-none text-gray-900 font-semibold focus:ring-0 p-0 pr-4"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Property</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Owner</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Price</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Status</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Submitted</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading properties...</td></tr>
              ) : filteredProperties.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No properties found</td></tr>
              ) : (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          <img src={getPropertyImage(prop.id)} alt={prop.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{prop.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                            {(() => {
                              const loc = Array.isArray(prop.locations) ? prop.locations[0] : prop.locations;
                              if (loc?.locality || loc?.city) {
                                return [loc.locality, loc.city].filter(Boolean).join(', ');
                              }
                              return prop.city || 'Unknown location';
                            })()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="font-medium text-sm">{prop.owner?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap text-sm">
                      {prop.price_display || (prop.price_num ? `₹${Number(prop.price_num).toLocaleString('en-IN')}` : prop.price ? `₹${Number(prop.price).toLocaleString('en-IN')}` : 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        prop.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' : 
                        prop.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 
                        'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {prop.status ? prop.status.charAt(0).toUpperCase() + prop.status.slice(1) : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(prop.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/property/${prop.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="View Property"
                        >
                          <Eye size={16} />
                        </Link>
                        {prop.status !== 'approved' && (
                          <button 
                            disabled={actionLoadingId === prop.id}
                            onClick={() => onUpdateStatus(prop.id, 'approved')}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50" 
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {prop.status !== 'rejected' && (
                          <button 
                            disabled={actionLoadingId === prop.id}
                            onClick={() => onUpdateStatus(prop.id, 'rejected')}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50" 
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button 
                          disabled={actionLoadingId === prop.id}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                              onDelete(prop.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

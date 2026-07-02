import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { Trash2, EyeOff, Eye, Star } from 'lucide-react';

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    const { reviews: data } = await adminService.getReviews();
    setReviews(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'published' | 'hidden') => {
    setActionLoadingId(id);
    await adminService.updateReviewStatus(id, status);
    await fetchReviews();
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoadingId(id);
    await adminService.deleteReview(id);
    await fetchReviews();
    setActionLoadingId(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Poppins'] text-gray-900 mb-8">Review Management</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Reviewer</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Property</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Rating</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Comment</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm">Status</th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading reviews...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No reviews found</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{review.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{review.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {review.property?.title || 'Unknown Property'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "transparent"} className={i < review.rating ? "" : "text-gray-500/50"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={review.comment}>
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        review.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {review.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {review.status === 'published' ? (
                          <button 
                            disabled={actionLoadingId === review.id}
                            onClick={() => handleUpdateStatus(review.id, 'hidden')}
                            className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors disabled:opacity-50" 
                            title="Hide Review"
                          >
                            <EyeOff size={16} />
                          </button>
                        ) : (
                          <button 
                            disabled={actionLoadingId === review.id}
                            onClick={() => handleUpdateStatus(review.id, 'published')}
                            className="p-2 text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50" 
                            title="Publish Review"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button 
                          disabled={actionLoadingId === review.id}
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50" 
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

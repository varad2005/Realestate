import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';
import { PropertyAddonOrder, addonService } from '@/services/addonService';

export function AdminAddonOrdersPage() {
  const [orders, setOrders] = useState<PropertyAddonOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await addonService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load addon orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await addonService.updateOrderStatus(orderId, newStatus);
      loadOrders(); // reload
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.order_status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Poppins'] text-gray-900">Add-on Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track premium service requests from users</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search Orders..." 
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent text-sm w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent text-sm appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Order Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Property</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-center">Payment</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-center">Fulfillment</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-500/50 mb-3" />
                    <p className="text-base font-medium text-gray-900">No Orders Found</p>
                    <p className="text-sm mt-1">No property addon orders match your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.addon?.name || 'Unknown Addon'}</p>
                      <p className="text-xs text-gray-500 mt-1 uppercase">ID: {order.id.split('-')[0]}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/property/${order.property_id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline truncate block max-w-[200px]">
                        {order.property?.title || 'View Property'}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        order.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-success/40' :
                        order.payment_status === 'Failed' ? 'bg-red-500/10 text-red-500 border-destructive/40' :
                        'bg-yellow-500/10 text-yellow-500 border-warning/40'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {order.order_status === 'Completed' ? <CheckCircle size={14} className="text-emerald-500" /> :
                         order.order_status === 'Cancelled' ? <XCircle size={14} className="text-red-500" /> :
                         <Clock size={14} className="text-indigo-600" />}
                        <span className="text-sm font-medium text-gray-900">{order.order_status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-pink-600"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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

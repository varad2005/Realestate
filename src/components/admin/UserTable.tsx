import { ShieldAlert, Trash2 } from 'lucide-react';

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  actionLoadingId: string | null;
  onUpdateRole: (id: string, role: 'admin' | 'owner' | 'dealer') => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, isLoading, actionLoadingId, onUpdateRole, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider">Created At</th>
              <th className="px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={`transition-colors ${u.role === 'admin' ? 'bg-indigo-600/10/20' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-medium flex items-center gap-2 text-gray-900">
                    {u.name}
                    {u.role === 'admin' && <ShieldAlert size={14} className="text-indigo-600" />}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      disabled={actionLoadingId === u.id}
                      value={u.role}
                      onChange={(e) => onUpdateRole(u.id, e.target.value as 'admin' | 'owner' | 'dealer')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer disabled:opacity-50 ${
                        u.role === 'admin' ? 'bg-indigo-600/20 text-indigo-600' :
                        u.role === 'dealer' ? 'bg-purple-600/20 text-purple-600' :
                        'bg-gray-50 text-gray-900'
                      }`}
                    >
                      <option value="owner">Owner</option>
                      <option value="dealer">Dealer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end">
                    <button 
                      disabled={actionLoadingId === u.id || u.role === 'admin'}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                          onDelete(u.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                      title={u.role === 'admin' ? "Cannot delete admin users" : "Delete User"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

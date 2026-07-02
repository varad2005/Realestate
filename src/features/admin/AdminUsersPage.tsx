import { useUsers } from '@/hooks/useUsers';
import { UserTable } from '@/components/admin/UserTable';

export function AdminUsersPage() {
  const { users, isLoading, error, actionLoadingId, updateRole, deleteUser } = useUsers();

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-['Poppins']">User Management</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-destructive/40 rounded-xl text-red-500">
          {error}
        </div>
      )}

      <UserTable 
        users={users} 
        isLoading={isLoading} 
        actionLoadingId={actionLoadingId} 
        onUpdateRole={updateRole} 
        onDelete={deleteUser}
      />
    </div>
  );
}

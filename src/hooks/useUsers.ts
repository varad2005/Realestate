import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminService.getAllUsers();
    if (result.error) {
      console.error(result.error);
      setError("Failed to load users.");
    } else {
      setUsers(result.users);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: string, role: 'admin' | 'owner' | 'dealer') => {
    setActionLoadingId(id);
    setError(null);
    const { user, error: updateError } = await adminService.updateUserRole(id, role);
    
    if (updateError) {
      console.error(updateError);
      setError(`Failed to update user role to ${role}.`);
    } else if (user) {
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    }
    setActionLoadingId(null);
  };

  const deleteUser = async (id: string) => {
    setActionLoadingId(id);
    setError(null);
    const { error: deleteError } = await adminService.deleteUser(id);
    
    if (deleteError) {
      console.error(deleteError);
      setError("Failed to delete user.");
    } else {
      // Optimistic update
      setUsers(prev => prev.filter(u => u.id !== id));
    }
    setActionLoadingId(null);
  };

  return { users, isLoading, error, actionLoadingId, updateRole, deleteUser, refetch: fetchUsers };
}

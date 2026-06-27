import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { useRealtimeProperties } from '@/hooks/useRealtimeProperties';

export function useProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    const result = await adminService.getAllProperties();
    if (result.error) {
      console.error(result.error);
      setError("Failed to load properties.");
    } else {
      setProperties(result.properties);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useRealtimeProperties(() => {
    // Silently refetch without loading spinner
    adminService.getAllProperties().then(result => {
      if (!result.error) setProperties(result.properties);
    });
  });

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setActionLoadingId(id);
    setError(null);
    const { property, error: updateError } = await adminService.updatePropertyStatus(id, status);
    
    if (updateError) {
      console.error(updateError);
      setError(`Failed to update property status to ${status}.`);
    } else if (property) {
      // Optimistic update
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
    setActionLoadingId(null);
  };

  const deleteProperty = async (id: string) => {
    setActionLoadingId(id);
    setError(null);
    const { error: deleteError } = await adminService.deleteProperty(id);
    
    if (deleteError) {
      console.error(deleteError);
      setError("Failed to delete property.");
    } else {
      // Optimistic update
      setProperties(prev => prev.filter(p => p.id !== id));
    }
    setActionLoadingId(null);
  };

  return { properties, isLoading, error, actionLoadingId, updateStatus, deleteProperty, refetch: fetchProperties };
}

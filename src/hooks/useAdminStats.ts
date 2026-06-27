import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/adminService';

export function useAdminStats() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    // setIsLoading(true); // Don't show loading overlay for silent refetches
    setError(null);
    const result = await adminService.getDashboardData();
    if (result.error) {
      console.error(result.error);
      setError("Failed to load dashboard data.");
    } else {
      setData(result);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, isLoading, error, refetch: fetchStats };
}

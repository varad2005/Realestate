import { useState, useEffect, useCallback } from 'react';
import { propertyService, PropertyFilters, UIProperty } from '@/services/propertyService';
import { useRealtimeProperties } from '@/hooks/useRealtimeProperties';

interface UseAllPropertiesReturn {
  properties: UIProperty[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAllProperties(filters: PropertyFilters = {}, page: number = 1, limit: number = 10): UseAllPropertiesReturn {
  const [properties, setProperties] = useState<UIProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertyService.getAllProperties(filters, page, limit);
      setProperties(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), page, limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleRealtime = useCallback(() => {
    // Silently refresh without turning on the big loading spinner
    propertyService.getAllProperties(filters, page, limit).then(setProperties).catch(console.error);
  }, [JSON.stringify(filters), page, limit]);

  useRealtimeProperties(handleRealtime);

  return { properties, loading, error, refetch: fetchProperties };
}

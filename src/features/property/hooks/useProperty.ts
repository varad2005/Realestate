import { useState, useEffect } from 'react';
import { DetailedProperty } from '@/types';
import { propertyService } from '@/services/propertyService';
import { supabase } from '@/lib/supabase';

interface UsePropertyReturn {
  data: DetailedProperty | null;
  loading: boolean;
  error: string | null;
}

export function useProperty(id: string | undefined): UsePropertyReturn {
  const [data, setData] = useState<DetailedProperty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No property ID provided.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const propertyData = await propertyService.getPropertyById(id);
        if (isMounted) {
          setData(propertyData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch property details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    const channel = supabase
      .channel(`property-detail-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'properties', filter: `id=eq.${id}` },
        () => {
          // Re-fetch when the property is updated to get fresh relational data
          fetchProperty();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { data, loading, error };
}

import { useState, useEffect } from 'react';
import { propertyService, PopularLocality } from '@/services/propertyService';

export function usePopularLocalities() {
  const [localities, setLocalities] = useState<PopularLocality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocalities() {
      setLoading(true);
      try {
        const data = await propertyService.getPopularLocalities();
        setLocalities(data);
      } catch (err) {
        console.error("Failed to fetch popular localities", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLocalities();
  }, []);

  return { localities, loading };
}

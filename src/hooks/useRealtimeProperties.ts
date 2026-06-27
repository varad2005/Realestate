import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type Payload = any; // Supabase payload type

export function useRealtimeProperties(callback: (payload: Payload) => void) {
  const savedCallback = useRef(callback);

  // Keep the latest callback in a ref to avoid stale closures
  // without needing to put callback in the dependency array
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Generate a unique channel name to prevent React 18 Strict Mode 
    // from reusing a channel that is already subscribed/subscribing
    const channelId = `properties-realtime-${Date.now()}-${Math.random()}`;
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Realtime event received', payload.eventType);
          console.log('Realtime update:', payload);
          if (savedCallback.current) {
            savedCallback.current(payload);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime connected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array as requested to prevent multiple subscriptions
}

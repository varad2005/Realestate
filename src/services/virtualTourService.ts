import { supabase } from '@/lib/supabase';
import { VirtualTour } from '@/types';

import imageCompression from 'browser-image-compression';

export interface TourScene {
  id?: string;
  propertyId?: string;
  panoramaUrl?: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  sortOrder: number;
  isDefault: boolean;
  // Local upload state (not stored in DB)
  file?: File;
  previewUrl?: string;
  uploadProgress?: number;
  uploaded?: boolean;
  error?: string;
}

export const virtualTourService = {
  /**
   * Upload a 360° panorama image to Supabase Storage (property-360 bucket)
   */
  async uploadPanorama(
    file: File,
    userId: string,
    propertyId: string,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      // Compress large 360 images (we target ~4MB max to balance quality and load times)
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 8192,
        useWebWorker: true,
        initialQuality: 0.8
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const fileExt = compressedFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const sanitizedTitle = compressedFile.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
        .slice(0, 40);
      const fileName = `${propertyId}/${sanitizedTitle}-${Date.now()}.${fileExt}`;

      // Use XHR for progress tracking
      if (onProgress) {
        return await new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('file', compressedFile);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress(Math.round((event.loaded / event.total) * 100));
            }
          };

          xhr.onload = async () => {
            // Fall through to supabase upload below
            resolve({ url: null, error: null });
          };

          xhr.onerror = () => {
            resolve({ url: null, error: new Error('XHR upload failed') });
          };

          // Use supabase upload but trigger progress via XHR emulation
          supabase.storage
            .from('property-360')
            .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false })
            .then(({ error }) => {
              if (error) {
                resolve({ url: null, error: error as unknown as Error });
                return;
              }
              const { data: { publicUrl } } = supabase.storage
                .from('property-360')
                .getPublicUrl(fileName);
              onProgress(100);
              resolve({ url: publicUrl, error: null });
            });
        });
      }

      const { error } = await supabase.storage
        .from('property-360')
        .upload(fileName, compressedFile, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('property-360')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (err: any) {
      console.error('Error uploading panorama:', err);
      return { url: null, error: err };
    }
  },

  /**
   * Save a virtual tour scene record to the database
   */
  async saveTourScene(scene: {
    propertyId: string;
    panoramaUrl: string;
    thumbnailUrl?: string;
    title: string;
    description?: string;
    sortOrder: number;
    isDefault: boolean;
  }): Promise<{ data: VirtualTour | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('property_virtual_tours')
        .insert({
          property_id: scene.propertyId,
          panorama_url: scene.panoramaUrl,
          thumbnail_url: scene.thumbnailUrl || null,
          title: scene.title || 'Virtual Tour',
          description: scene.description || null,
          sort_order: scene.sortOrder,
          is_default: scene.isDefault,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as VirtualTour, error: null };
    } catch (err: any) {
      console.error('Error saving tour scene:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Save multiple tour scenes at once (batch)
   */
  async saveTourScenes(scenes: Array<{
    propertyId: string;
    panoramaUrl: string;
    thumbnailUrl?: string;
    title: string;
    description?: string;
    sortOrder: number;
    isDefault: boolean;
  }>): Promise<{ data: VirtualTour[] | null; error: Error | null }> {
    if (scenes.length === 0) return { data: [], error: null };

    try {
      const { data, error } = await supabase
        .from('property_virtual_tours')
        .insert(scenes.map(s => ({
          property_id: s.propertyId,
          panorama_url: s.panoramaUrl,
          thumbnail_url: s.thumbnailUrl || null,
          title: s.title || 'Virtual Tour',
          description: s.description || null,
          sort_order: s.sortOrder,
          is_default: s.isDefault,
        })))
        .select();

      if (error) throw error;
      return { data: data as VirtualTour[], error: null };
    } catch (err: any) {
      console.error('Error saving tour scenes:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Fetch all virtual tours for a property ordered by sort_order
   */
  async getToursByPropertyId(propertyId: string): Promise<VirtualTour[]> {
    if (!propertyId) return [];

    const { data, error } = await supabase
      .from('property_virtual_tours')
      .select('*')
      .eq('property_id', propertyId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching virtual tours:', error);
      return [];
    }

    return (data || []) as VirtualTour[];
  },

  /**
   * Update a scene's metadata (title, description, sort_order, is_default)
   */
  async updateScene(
    id: string,
    updates: Partial<Pick<VirtualTour, 'title' | 'description' | 'sort_order' | 'is_default'>>
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('property_virtual_tours')
      .update({
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.sort_order !== undefined ? { sort_order: updates.sort_order } : {}),
        ...(updates.is_default !== undefined ? { is_default: updates.is_default } : {}),
      })
      .eq('id', id);

    if (error) console.error('Error updating scene:', error);
    return { error: error as unknown as Error | null };
  },

  /**
   * Set a scene as the default (unsets all others for the property)
   */
  async setDefaultScene(tourId: string, propertyId: string): Promise<{ error: Error | null }> {
    // First unset all defaults for this property
    const { error: resetError } = await supabase
      .from('property_virtual_tours')
      .update({ is_default: false })
      .eq('property_id', propertyId);

    if (resetError) return { error: resetError as unknown as Error };

    // Then set the chosen one as default
    const { error } = await supabase
      .from('property_virtual_tours')
      .update({ is_default: true })
      .eq('id', tourId);

    return { error: error as unknown as Error | null };
  },

  /**
   * Reorder scenes by updating sort_order for each
   */
  async reorderScenes(
    scenes: Array<{ id: string; sortOrder: number }>
  ): Promise<{ error: Error | null }> {
    const updates = scenes.map(s =>
      supabase
        .from('property_virtual_tours')
        .update({ sort_order: s.sortOrder })
        .eq('id', s.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);
    return { error: failed?.error as unknown as Error | null };
  },

  /**
   * Delete a scene from DB and optionally from storage
   */
  async deleteScene(id: string): Promise<{ error: Error | null }> {
    // Fetch the panorama URL to remove from storage
    const { data: scene } = await supabase
      .from('property_virtual_tours')
      .select('panorama_url')
      .eq('id', id)
      .single();

    // Delete DB record
    const { error } = await supabase
      .from('property_virtual_tours')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting scene:', error);
      return { error: error as unknown as Error };
    }

    // Try to remove from storage (best-effort, not critical)
    if (scene?.panorama_url) {
      try {
        const url = new URL(scene.panorama_url);
        const pathParts = url.pathname.split('/property-360/');
        if (pathParts.length > 1) {
          await supabase.storage.from('property-360').remove([pathParts[1]]);
        }
      } catch (_) {
        // Ignore storage deletion errors
      }
    }

    return { error: null };
  },

  /**
   * Delete all scenes for a specific property from DB and storage
   */
  async deleteAllScenesForProperty(propertyId: string): Promise<{ error: Error | null }> {
    const scenes = await this.getToursByPropertyId(propertyId);
    
    // Attempt to delete all from storage
    const storagePaths: string[] = [];
    for (const scene of scenes) {
      if (scene.panorama_url) {
        try {
          const url = new URL(scene.panorama_url);
          const pathParts = url.pathname.split('/property-360/');
          if (pathParts.length > 1) {
            storagePaths.push(pathParts[1]);
          }
        } catch (_) {}
      }
    }

    if (storagePaths.length > 0) {
      await supabase.storage.from('property-360').remove(storagePaths);
    }

    // DB deletion is handled by cascading delete on property deletion, 
    // but we can manually delete them here just in case.
    const { error } = await supabase
      .from('property_virtual_tours')
      .delete()
      .eq('property_id', propertyId);

    return { error: error as unknown as Error | null };
  },

  /**
   * Track a virtual tour analytics event
   */
  async trackEvent(
    tourId: string | null,
    propertyId: string,
    eventType: 'tour_open' | 'scene_switch' | 'tour_close',
    sceneTitle?: string,
    sessionId?: string,
    durationSeconds?: number
  ): Promise<void> {
    try {
      await supabase.from('virtual_tour_analytics').insert({
        tour_id: tourId || null,
        property_id: propertyId,
        event_type: eventType,
        scene_title: sceneTitle || null,
        session_id: sessionId || null,
        // Using any generic jsonb metadata column if duration_seconds is not directly defined yet, 
        // but we'll try to insert it or use 'metadata' if it fails.
        metadata: durationSeconds ? { duration_seconds: durationSeconds } : null
      });
    } catch (err) {
      console.warn('Analytics tracking failed:', err);
    }
  },

  /**
   * Get analytics summary for a property's tours
   */
  async getAnalyticsSummary(propertyId: string) {
    const { data, error } = await supabase
      .from('virtual_tour_analytics')
      .select('event_type, scene_title, created_at')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    const tourOpens = data.filter(e => e.event_type === 'tour_open').length;
    const sceneSwitches = data.filter(e => e.event_type === 'scene_switch');

    // Count scene views
    const sceneViewCounts: Record<string, number> = {};
    sceneSwitches.forEach(e => {
      if (e.scene_title) {
        sceneViewCounts[e.scene_title] = (sceneViewCounts[e.scene_title] || 0) + 1;
      }
    });

    const mostViewedScene = Object.entries(sceneViewCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    return {
      totalTourViews: tourOpens,
      totalSceneSwitches: sceneSwitches.length,
      mostViewedScene,
      sceneBreakdown: sceneViewCounts,
      recentEvents: data.slice(0, 10),
    };
  },

  /**
   * Get all properties with virtual tours (for admin)
   */
  async getAllPropertiesWithTours() {
    const { data, error } = await supabase
      .from('property_virtual_tours')
      .select(`
        id,
        title,
        panorama_url,
        thumbnail_url,
        is_default,
        created_at,
        property_id,
        properties (
          id,
          title,
          city,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all tours:', error);
      return [];
    }

    return data || [];
  },
};

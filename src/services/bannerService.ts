import { supabase } from '@/lib/supabase';

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image_url: string;
  mobile_image_url?: string;
  badge_text?: string;
  overlay_opacity: number;
  text_alignment: 'left' | 'center' | 'right';
  text_color: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const bannerService = {
  /**
   * Fetch all active banners that are currently scheduled to be displayed
   * Ordered by display_order
   */
  async getActiveBanners(): Promise<HeroBanner[]> {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching active banners:', error);
      throw error;
    }

    // The RLS policy already handles start_date and end_date filtering for public access,
    // but just in case, we could also filter here. RLS is preferred.
    return data as HeroBanner[];
  },

  /**
   * Fetch all banners for Admin Panel
   */
  async getAllBanners(): Promise<HeroBanner[]> {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all banners:', error);
      throw error;
    }

    return data as HeroBanner[];
  },

  /**
   * Create a new banner
   */
  async createBanner(banner: Partial<HeroBanner>): Promise<HeroBanner> {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert(banner)
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      throw error;
    }

    return data as HeroBanner;
  },

  /**
   * Update an existing banner
   */
  async updateBanner(id: string, updates: Partial<HeroBanner>): Promise<HeroBanner> {
    const { data, error } = await supabase
      .from('hero_banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating banner:', error);
      throw error;
    }

    return data as HeroBanner;
  },

  /**
   * Delete a banner
   */
  async deleteBanner(id: string): Promise<void> {
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  /**
   * Upload banner image to Supabase Storage
   */
  async uploadBannerImage(file: File, filename: string): Promise<string> {
    const fileExt = filename.split('.').pop();
    const filePath = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('hero_banners')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading banner image:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('hero_banners')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

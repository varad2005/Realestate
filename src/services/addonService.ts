import { supabase } from '@/lib/supabase';

export interface AddonService {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  detailed_description?: string;
  category: string;
  icon?: string;
  image_url?: string;
  base_price: number;
  tax_percentage: number;
  duration_days?: number;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyAddonOrder {
  id: string;
  property_id: string;
  addon_service_id: string;
  quantity: number;
  price_at_purchase: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // relations
  addon?: AddonService;
  property?: any;
}

export const addonService = {
  /**
   * Fetch all active addon services for public/user view
   */
  async getActiveServices(): Promise<AddonService[]> {
    const { data, error } = await supabase
      .from('addon_services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching active addons:', error);
      throw error;
    }
    return data as AddonService[];
  },

  /**
   * Fetch all addon services for Admin Panel
   */
  async getAllServices(): Promise<AddonService[]> {
    const { data, error } = await supabase
      .from('addon_services')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all addons:', error);
      throw error;
    }
    return data as AddonService[];
  },

  /**
   * Create a new addon service
   */
  async createService(service: Partial<AddonService>): Promise<AddonService> {
    const { data, error } = await supabase
      .from('addon_services')
      .insert(service)
      .select()
      .single();

    if (error) {
      console.error('Error creating addon:', error);
      throw error;
    }
    return data as AddonService;
  },

  /**
   * Update an existing addon service
   */
  async updateService(id: string, updates: Partial<AddonService>): Promise<AddonService> {
    const { data, error } = await supabase
      .from('addon_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating addon:', error);
      throw error;
    }
    return data as AddonService;
  },

  /**
   * Delete an addon service
   */
  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('addon_services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting addon:', error);
      throw error;
    }
  },

  /**
   * Upload image/icon to Supabase Storage
   */
  async uploadAddonImage(file: File, filename: string): Promise<string> {
    const fileExt = filename.split('.').pop();
    const filePath = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('addon_services')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading addon image:', error);
      throw error;
    }

    const { data } = supabase.storage
      .from('addon_services')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Fetch all orders for a specific property (For user dashboard)
   */
  async getOrdersForProperty(propertyId: string): Promise<PropertyAddonOrder[]> {
    const { data, error } = await supabase
      .from('property_addon_orders')
      .select(`
        *,
        addon:addon_services(*)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching property addon orders:', error);
      throw error;
    }
    return data as PropertyAddonOrder[];
  },

  /**
   * Create orders (Used after property is submitted or when buying standalone)
   */
  async createOrders(orders: Partial<PropertyAddonOrder>[]): Promise<PropertyAddonOrder[]> {
    const { data, error } = await supabase
      .from('property_addon_orders')
      .insert(orders)
      .select();

    if (error) {
      console.error('Error creating addon orders:', error);
      throw error;
    }
    return data as PropertyAddonOrder[];
  },

  /**
   * Admin: Get all orders across platform
   */
  async getAllOrders(): Promise<PropertyAddonOrder[]> {
    const { data, error } = await supabase
      .from('property_addon_orders')
      .select(`
        *,
        addon:addon_services(*),
        property:properties(id, title)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all addon orders:', error);
      throw error;
    }
    return data as PropertyAddonOrder[];
  },

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('property_addon_orders')
      .update({ order_status: status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

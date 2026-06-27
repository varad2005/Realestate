import { supabase } from '@/lib/supabase';

export const adminService = {
  async getDashboardData() {
    const [usersRes, propertiesRes] = await Promise.all([
      supabase.from('users').select('id, name, email, created_at').order('created_at', { ascending: false }),
      supabase.from('properties').select('id, title, status, price, city, created_at, owner:users!properties_owner_id_fkey(name)').order('created_at', { ascending: false })
    ]);

    if (usersRes.error || propertiesRes.error) {
      return { error: usersRes.error || propertiesRes.error };
    }

    const users = usersRes.data || [];
    const properties = propertiesRes.data || [];

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Users Stats
    const currentUsers = users.length;
    const usersLast7Days = users.filter(u => new Date(u.created_at) >= sevenDaysAgo).length;
    const usersPrev7Days = users.filter(u => {
      const d = new Date(u.created_at);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    // Property Stats
    const currentProperties = properties.length;
    const propsLast7Days = properties.filter(p => new Date(p.created_at) >= sevenDaysAgo).length;
    const propsPrev7Days = properties.filter(p => {
      const d = new Date(p.created_at);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    const approvedProps = properties.filter(p => p.status === 'approved');
    const approvedLast7Days = approvedProps.filter(p => new Date(p.created_at) >= sevenDaysAgo).length;
    const approvedPrev7Days = approvedProps.filter(p => {
      const d = new Date(p.created_at);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    const pendingProps = properties.filter(p => p.status === 'pending');
    const pendingLast7Days = pendingProps.filter(p => new Date(p.created_at) >= sevenDaysAgo).length;
    const pendingPrev7Days = pendingProps.filter(p => {
      const d = new Date(p.created_at);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    const rejectedProps = properties.filter(p => p.status === 'rejected');
    const rejectedLast7Days = rejectedProps.filter(p => new Date(p.created_at) >= sevenDaysAgo).length;
    const rejectedPrev7Days = rejectedProps.filter(p => {
      const d = new Date(p.created_at);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    // Charts Data (Line Chart: Last 7 days)
    const lineChartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      lineChartData.push({
        date: dateStr,
        Approved: properties.filter(p => p.status === 'approved' && new Date(p.created_at).toDateString() === date.toDateString()).length,
        Pending: properties.filter(p => p.status === 'pending' && new Date(p.created_at).toDateString() === date.toDateString()).length,
        Rejected: properties.filter(p => p.status === 'rejected' && new Date(p.created_at).toDateString() === date.toDateString()).length,
      });
    }

    // Charts Data (Donut Chart: Properties by City)
    const cityCounts: Record<string, number> = {};
    properties.forEach(p => {
      const city = p.city ? p.city.trim() : 'Other';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    const donutChartData = Object.entries(cityCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 cities

    // Recent Activity (Interleave recent users and properties)
    const recentActivity = [
      ...properties.slice(0, 10).map(p => ({
        id: `p-${p.id}`,
        type: p.status === 'approved' ? 'property_approved' : p.status === 'rejected' ? 'property_rejected' : 'property_submitted',
        title: p.status === 'approved' ? 'Property approved' : p.status === 'rejected' ? 'Property rejected' : 'New property submitted',
        subtitle: p.title,
        created_at: p.created_at
      })),
      ...users.slice(0, 10).map(u => ({
        id: `u-${u.id}`,
        type: 'user_registered',
        title: 'New user registered',
        subtitle: u.email,
        created_at: u.created_at
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

    return {
      stats: {
        totalUsers: currentUsers,
        usersTrend: calcTrend(usersLast7Days, usersPrev7Days),
        totalProperties: currentProperties,
        propertiesTrend: calcTrend(propsLast7Days, propsPrev7Days),
        approvedProperties: approvedProps.length,
        approvedTrend: calcTrend(approvedLast7Days, approvedPrev7Days),
        pendingProperties: pendingProps.length,
        pendingTrend: calcTrend(pendingLast7Days, pendingPrev7Days),
        rejectedProperties: rejectedProps.length,
        rejectedTrend: calcTrend(rejectedLast7Days, rejectedPrev7Days),
      },
      lineChartData,
      donutChartData,
      recentActivity,
      recentProperties: properties.slice(0, 5),
      error: null
    };
  },

  async getAllProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, status, price, price_num, price_display, city, created_at, owner:users!properties_owner_id_fkey(name, email), locations(city, locality)')
      .order('created_at', { ascending: false });

    return { properties: data || [], error };
  },

  async updatePropertyStatus(propertyId: string, status: 'approved' | 'rejected' | 'pending') {
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId)
      .select()
      .single();

    return { property: data, error };
  },

  async deleteProperty(propertyId: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);
      
    return { error };
  },

  async getSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'general')
      .single();
    
    return { settings: data?.value || {}, error };
  },

  async updateSettings(settings: any) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'general', value: settings, updated_at: new Date().toISOString() });
    
    return { error };
  },

  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:users!reviews_user_id_fkey(name, email), property:properties!reviews_property_id_fkey(title)')
      .order('created_at', { ascending: false });
    
    return { reviews: data || [], error };
  },

  async updateReviewStatus(reviewId: string, status: 'published' | 'hidden') {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);
    
    return { error };
  },

  async deleteReview(reviewId: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    return { error };
  },

  async getActivityLogs() {
    const [usersRes, propertiesRes] = await Promise.all([
      supabase.from('users').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(50),
      supabase.from('properties').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(50)
    ]);

    const users = usersRes.data || [];
    const properties = propertiesRes.data || [];

    const recentActivity = [
      ...properties.map(p => ({
        id: `p-${p.id}`,
        type: p.status === 'approved' ? 'property_approved' : p.status === 'rejected' ? 'property_rejected' : 'property_submitted',
        title: p.status === 'approved' ? 'Property approved' : p.status === 'rejected' ? 'Property rejected' : 'New property submitted',
        subtitle: p.title,
        created_at: p.created_at
      })),
      ...users.map(u => ({
        id: `u-${u.id}`,
        type: 'user_registered',
        title: 'New user registered',
        subtitle: u.email,
        created_at: u.created_at
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { logs: recentActivity, error: usersRes.error || propertiesRes.error };
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    return { users: data || [], error };
  },

  async updateUserRole(userId: string, role: 'admin' | 'owner' | 'dealer') {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    return { user: data, error };
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
      
    return { error };
  }
};

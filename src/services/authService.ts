import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'dealer' | 'builder' | 'admin';
  avatar_url?: string;
  created_at?: string;
}

export const authService = {
  async signUp(name: string, email: string, password: string, role: 'owner' | 'dealer' | 'builder' | 'admin') {
    if (!password) {
      return { user: null, session: null, userData: null, error: new Error("Password is required") };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (authError) return { user: null, session: null, userData: null, error: authError };
    if (!authData.user) return { user: null, session: null, userData: null, error: new Error('User creation failed') };

    // Insert user into custom users table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        name,
        email,
        role,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error inserting into users table:', dbError);
      return { user: authData.user, session: authData.session, userData: null, error: dbError };
    }

    return { user: authData.user, session: authData.session, userData, error: null };
  },

  async login(email: string, password: string) {
    if (!password) {
      return { user: null, session: null, userData: null, error: new Error("Password is required") };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, session: null, userData: null, error };
    if (!data.user) return { user: null, session: null, userData: null, error: new Error('Login failed') };

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (fetchError || !userData) {
      console.error('Error fetching user profile:', fetchError);
      // Strictly fail if user data is missing
      return { user: data.user, session: data.session, userData: null, error: new Error('User profile not found in database') };
    }

    console.log("LOGIN SUCCESS:", data.user.id);
    return { user: data.user, session: data.session, userData, error: null };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return { session: null, error };
    return { session, error: null };
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { userData: null, error: error || new Error('User profile not found') };
    }

    return { userData: data as User, error: null };
  },
};

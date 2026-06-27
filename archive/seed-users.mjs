import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import WebSocket from 'ws';

// Simple .env parser since dotenv is not installed
const envStr = fs.readFileSync('.env', 'utf8');
const env = {};
envStr.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim();
    env[k] = v;
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  global: { fetch: fetch, headers: { 'x-my-custom-header': 'seed-users' } },
  realtime: { transport: WebSocket }
});

const users = [
  { name: 'Admin Demo', email: 'admin@demo.com', role: 'admin' },
  { name: 'Owner Demo', email: 'owner@demo.com', role: 'owner' },
  { name: 'Dealer Demo', email: 'dealer@demo.com', role: 'dealer' },
  { name: 'Buyer Demo', email: 'buyer@demo.com', role: 'buyer' },
  { name: 'Tenant Demo', email: 'tenant@demo.com', role: 'tenant' }
];

async function seed() {
  for (const u of users) {
    console.log(`Creating ${u.email}...`);
    // Attempt sign up
    const { data, error } = await supabase.auth.signUp({
      email: u.email,
      password: 'password123',
      options: {
        data: { name: u.name, role: u.role }
      }
    });

    if (error) {
      console.log(`Error creating auth user ${u.email}:`, error.message);
      // Try logging in to get the user id if they already exist
      if (error.message.includes('already registered')) {
        const { data: signInData } = await supabase.auth.signInWithPassword({
            email: u.email,
            password: 'password123'
        });
        if (signInData?.user) {
            await insertToUsers(signInData.user.id, u);
        }
      }
      continue;
    }

    if (data.user) {
        await insertToUsers(data.user.id, u);
    }
  }
}

async function insertToUsers(userId, u) {
    // Attempt to update the public.users table manually 
    // In case there's no trigger or it fails
    const { error: dbError } = await supabase.from('users').upsert({
      id: userId,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: new Date().toISOString()
    });

    if (dbError) {
      console.log(`DB error for ${u.email}:`, dbError.message);
    } else {
      console.log(`Created ${u.email} successfully.`);
    }
}

seed();

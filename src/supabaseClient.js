import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch latest 20 posts ordered by created_at descending
export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, caption, image_url, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
  return data;
}


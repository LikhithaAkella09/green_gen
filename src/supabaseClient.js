import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsnxseznnjlkppqksekg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbnhzZXpubmpsa3BwcWtzZWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODU4NzYsImV4cCI6MjA3Mzg2MTg3Nn0.UDhkIFzgHk3-q4nsOPiie0Q1El8B7alonkRQfpLe6Qw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmeizhiiznmhlzvmetkt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZWl6aGlpem5taGx6dm1ldGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODk5NjMsImV4cCI6MjA4MzY2NTk2M30.ktzmqQmfJZ4YJoP4k462rQ73MldLINO9yX9DB2L6W80';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);




// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://emsjhmtfcttthohqaobw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtc2pobXRmY3R0dGhvaHFhb2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTczMzUsImV4cCI6MjA2Nzc5MzMzNX0.N9My_poFOQTJZKAGp0uEhAMfuIECTDr4Zh37_KE8x_k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
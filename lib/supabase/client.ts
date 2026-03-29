import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
  );
}

// Browser-safe Supabase client — uses the public anon key only.
// Safe to import in client components.
// MVP: used for read operations only. All writes go through lib/supabase/server.ts.
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

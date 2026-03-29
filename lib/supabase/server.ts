import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
}

// Server-only client — uses the service role key, never exposed to the browser.
// The "server-only" import above causes a build error if this module is ever
// accidentally imported in a client component.
// Import this only in API routes and server components.
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

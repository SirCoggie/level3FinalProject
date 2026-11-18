import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_API_URL;

const supabasePublicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

if (!supabaseURL || !supabasePublicKey) {
  throw new Error("Missing Supabase environment variables in Vite config");
}

export const supabase = createClient(supabaseURL, supabasePublicKey);

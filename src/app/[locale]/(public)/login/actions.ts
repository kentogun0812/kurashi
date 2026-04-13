"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function checkEmailExists(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // Cách 1: Kiểm tra qua auth.users (Yêu cầu Service Role Key)
  if (supabaseServiceKey) {
    try {
      const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      
      if (!error && data?.users) {
        const userExists = data.users.some(u => u.email === email);
        if (userExists) {
          console.log(`[Admin] Email found: ${email}`);
          return true;
        }
      } else if (error) {
        console.error("[Admin] Error listing users:", error.message);
      }
    } catch (err) {
      console.error("[Admin] Unexpected error:", err);
    }
  }

  console.log(`[Admin] Email not found in auth.users, falling back to profiles check: ${email}`);

  // Cách 2: Kiểm tra qua bảng public.profiles (Dùng public client)
  // Lưu ý: Cần đảm bảo bảng profiles có cột email và đã được sync từ auth.users
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error("Profile check error:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Public check failed:", err);
    return false;
  }
}

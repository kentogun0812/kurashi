import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const t = await getTranslations('profile');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/profile');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('securityDesc')}</p>
      </div>

      <ProfileForm 
        user={user} 
        initialProfile={profile || { display_name: user.email?.split('@')[0], avatar_url: user.user_metadata?.avatar_url }} 
      />
    </div>
  );
}

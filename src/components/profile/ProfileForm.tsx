'use client';

import { useState, useTransition, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader2, AlertCircle, Camera, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function ProfileForm({ user, initialProfile }: { user: User; initialProfile: any }) {
  const t = useTranslations('profile');
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '/image/ava_1.jpg');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const availableAvatars = Array.from({ length: 10 }, (_, i) => `/image/ava_${i + 1}.jpg`);

  const handleImageUploadSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(t('uploadError'));
      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || t('uploadError'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg(t('pwdMismatch'));
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    
    try {
      if (newPassword) {
        const { error: pwdError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (pwdError) throw pwdError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });
        
      if (profileError) throw profileError;

      await supabase.auth.updateUser({
        data: {
           full_name: displayName,
           avatar_url: avatarUrl
        }
      });

      setSuccessMsg(t('updateSuccess'));
      setNewPassword('');
      setConfirmPassword('');
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setErrorMsg(err.message || t('systemError'));
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isSaving || isPending;

  return (
    <div className="bg-card/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden">
        {errorMsg && (
          <div className="p-4 mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-destructive text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
            {successMsg}
          </div>
        )}

      <form onSubmit={handleUpdate} className="space-y-10">
        
        {/* Avatar Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Camera className="text-primary" />
            {t('avatarTitle')}
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-28 h-28 rounded-full shrink-0 relative group">
              {/* Decorative gradient glow effect */}
              <div className="absolute -inset-1 bg-foreground/10 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-500"></div>
              
              {/* Main Avatar Container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-[4px] border-background bg-muted shadow-[0_0_30px_rgba(0,0,0,0.1)] flex items-center justify-center">
                {isUploadingImage ? (
                  <Loader2 className="animate-spin text-primary w-8 h-8" />
                ) : (
                  <>
                    <Image 
                      src={avatarUrl} 
                      alt="Avatar" 
                      fill 
                      sizes="112px" 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-3">{t('avatarDesc')}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-dashed h-10 hover:border-primary hover:text-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {t('avatarUploadBtn')}
                </Button>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleImageUploadSubmit}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {availableAvatars.map((ava, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(ava)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                      avatarUrl === ava ? 'border-primary ring-primary ring-offset-2 ring-offset-background scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={ava} alt={`Ava ${idx}`} width={40} height={40} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="space-y-4 border-t border-border/50 pt-8">
           <h3 className="text-xl font-bold">{t('title')}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('emailLabel')}</label>
                <Input 
                  type="email" 
                  value={user.email || ''}
                  disabled
                  className="h-12 rounded-xl bg-secondary/50 border-transparent text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('nameLabel')}</label>
                <Input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 rounded-xl bg-background/50"
                  placeholder={t('namePlaceholder')}
                  required
                />
              </div>
           </div>
        </div>

        {/* Password Update Section */}
        <div className="space-y-4 border-t border-border/50 pt-8">
           <h3 className="text-xl font-bold">{t('securityTitle')}</h3>
           <p className="text-sm text-muted-foreground mb-2">{t('securityDesc')}</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('pwdLabel')}</label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 rounded-xl bg-background/50"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('pwdConfirmLabel')}</label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl bg-background/50"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
           </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            className="h-12 px-8 rounded-xl text-md font-semibold glow-primary" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {t('savingBtn')}
              </>
            ) : (
              t('saveBtn')
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}

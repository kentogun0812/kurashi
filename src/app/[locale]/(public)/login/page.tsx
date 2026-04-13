'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { FullScreenLoading } from '@/components/ui/full-screen-loading';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(searchParams.get('error') || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      
      try {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            setErrorMsg(error.message === 'Invalid login credentials' ? 'Email hoặc mật khẩu không chính xác' : error.message);
            return;
          }
          
          router.push(nextPath);
          router.refresh(); // Refresh layout to update auth state
        } else {
          if (!isLogin && password !== confirmPassword) {
            setErrorMsg('Mật khẩu xác nhận không khớp.');
            return;
          }

          const randomAva = `/image/ava_${Math.floor(Math.random() * 10) + 1}.jpg`;
          
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/api/auth/callback`,
              data: {
                full_name: email.split('@')[0],
                avatar_url: randomAva
              }
            }
          });
          
          if (error) {
            setErrorMsg(error.message);
            return;
          }

          if (data?.user && data?.session === null) {
            setSuccessMsg('Vui lòng kiểm tra email của bạn để xác nhận đăng ký.');
          } else {
            router.push(nextPath);
            router.refresh();
          }
        }
      } catch (err: any) {
         setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      {isPending && (
        <FullScreenLoading 
          message={isLogin ? 'Đang đăng nhập...' : 'Đang xử lý đăng ký...'} 
        />
      )}
      <div className="bg-card/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/30 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? 'Chào mừng bạn quay trở lại Kurashi' : 'Tham gia cộng đồng người Việt tại Nhật'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-destructive text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="pl-10 h-12 rounded-xl bg-background/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mật khẩu</label>
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl bg-background/50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-xl bg-background/50"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-md font-semibold glow-primary mt-2" 
              disabled={isPending}
            >
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

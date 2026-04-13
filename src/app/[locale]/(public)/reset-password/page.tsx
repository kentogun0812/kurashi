"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { FullScreenLoading } from "@/components/ui/full-screen-loading";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isExchanging, setIsExchanging] = useState(false);

  useEffect(() => {
    const handleCodeExchange = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");

      if (code) {
        setIsExchanging(true);
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setIsExchanging(false);
        if (error) {
          setErrorMsg("Link xác nhận đã hết hạn hoặc không hợp lệ: " + error.message);
        }
      } else {
        // If no code and no active session, redirect to login
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
        }
      }
    };
    handleCodeExchange();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Đã cập nhật mật khẩu mới thành công!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      {(isPending || isExchanging) && (
        <FullScreenLoading 
          message={isExchanging ? "Đang xác thực liên kết..." : "Đang cập nhật mật khẩu..."} 
        />
      )}

      <div className="bg-card/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground text-sm">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-destructive text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 flex flex-col items-center text-center gap-3">
              <CheckCircle2 size={32} className="text-green-500" />
              <p className="text-green-600 dark:text-green-400 font-medium">{successMsg}</p>
              <p className="text-xs text-muted-foreground">Đang chuyển về trang đăng nhập...</p>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold ml-1">Mật khẩu mới</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="pl-10 h-13 rounded-2xl bg-secondary/30 border-secondary/50 focus:bg-background transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold ml-1">Xác nhận mật khẩu</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="pl-10 h-13 rounded-2xl bg-secondary/30 border-secondary/50 focus:bg-background transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-13 rounded-2xl font-bold glow-primary mt-2">
                Cập nhật mật khẩu
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

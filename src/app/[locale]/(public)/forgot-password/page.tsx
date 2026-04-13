"use client";

import { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { FullScreenLoading } from "@/components/ui/full-screen-loading";
import { resetPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Vui lòng nhập email của bạn.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Yêu cầu đã được gửi! Vui lòng kiểm tra hộp thư đến của bạn để tiếp tục.");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      {isPending && <FullScreenLoading message="Đang gửi yêu cầu..." />}

      <div className="bg-card/60 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Quên mật khẩu?</h1>
            <p className="text-muted-foreground text-sm">
              Đừng lo lắng, chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
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
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 rounded-xl"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleResetRequest} className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold ml-1">Email</label>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={18} />
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="pl-10 h-13 rounded-2xl bg-secondary/30 border-secondary/50 focus:bg-background transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-13 rounded-2xl font-bold glow-primary mt-2">
                Gửi yêu cầu đặt lại
              </Button>

              <div className="text-center pt-2">
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

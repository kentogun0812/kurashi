"use client";

import { useRouter, Link, usePathname } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  ShoppingBag, 
  FileText, 
  Menu, 
  X, 
  User,
  ChevronRight,
  LogOut,
  Settings,
  UserCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { APP_INFO } from "@/const/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FullScreenLoading } from "@/components/ui/full-screen-loading";

export function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAvatarUrl(session.user.user_metadata?.avatar_url || '/image/ava_1.jpg');
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    };
    checkUser();
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setAvatarUrl(null);
      setIsMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { id: "procedures", name: t("procedures"), href: "/procedures", icon: FileText },
    { id: "events", name: t("events"), href: "/events", icon: Calendar },
    { id: "marketplace", name: t("marketplace"), href: "/marketplace", icon: ShoppingBag },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {isLoggingOut && (
        <FullScreenLoading message={t('loggingOut')} />
      )}

      <header
        className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border shadow-sm py-3 md:py-4 transition-all"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
                <span className="text-white font-bold text-xl">{APP_INFO.name.charAt(0)}</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-gradient hidden sm:block">
                {APP_INFO.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.id}
                    href={link.href as any}
                    className={cn(
                      "flex items-center gap-2 text-base font-semibold transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <div className="h-6 w-px bg-border mx-1" />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <button className="flex items-center gap-2 hover:bg-secondary/50 p-1.5 pr-4 rounded-full transition-all border border-border/50 bg-background/50 outline-none focus:ring-2 focus:ring-primary/20">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border relative">
                        <Image src={avatarUrl || '/image/ava_1.jpg'} alt="Avatar" fill sizes="32px" className="object-cover" />
                      </div>
                      <span className="text-sm font-semibold truncate max-w-[100px]">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </button>
                  } />
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-border/50 backdrop-blur-xl bg-background/95">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal p-2">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-bold leading-none">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem render={<Link href="/profile" className="w-full flex items-center gap-2 cursor-pointer p-2 rounded-xl transition-colors" />}>
                        <UserCircle size={16} />
                        <span>{t('profile')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2 rounded-xl transition-colors cursor-pointer gap-2">
                        <Settings size={16} />
                        <span>{t('settings')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="p-2 rounded-xl transition-colors cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut size={16} />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !pathname.endsWith('/login') ? (
                <Button className="h-10 px-8 glow-primary font-bold rounded-xl" render={<Link href="/login" />} nativeButton={false}>
                    {t('login')}
                </Button>
              ) : null}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher />
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-[999] bg-background flex flex-col transition-all duration-300 md:hidden",
          isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 shadow-none pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">{APP_INFO.name.charAt(0)}</span>
              </div>
              <span className="text-xl font-bold text-gradient">{APP_INFO.name}</span>
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col p-6 gap-3 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href as any}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98]",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "bg-secondary/40 hover:bg-secondary/60 text-foreground border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    )}>
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-lg">{link.name}</span>
                  </div>
                  <ChevronRight size={18} className={cn("transition-transform", isActive ? "translate-x-1" : "opacity-50")} />
                </Link>
              );
            })}
            
            <div className="flex flex-col gap-4 mt-auto pb-10">
              {user ? (
                <>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-primary/20">
                      <Image src={avatarUrl || '/image/ava_1.jpg'} alt="Avatar" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                      <span className="text-sm text-muted-foreground">{t('profile')}</span>
                    </div>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full text-lg py-6 rounded-2xl font-bold gap-3 text-destructive border-destructive/20 hover:bg-destructive/5"
                  >
                    <LogOut size={20} />
                    {t('logout')}
                  </Button>
                </>
              ) : !pathname.endsWith('/login') ? (
                <Button className="w-full h-14 text-lg rounded-2xl glow-primary font-bold" render={<Link href="/login" onClick={() => setIsMobileMenuOpen(false)} />} nativeButton={false}>
                    {t('login')}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

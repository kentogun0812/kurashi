'use client';

import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Settings, FileText, Users, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/procedures", icon: FileText, label: "Procedures" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-[64px] md:top-[72px] bottom-0 left-0 w-64 bg-card/80 backdrop-blur-2xl border-r border-border hidden md:flex flex-col z-40 shadow-sm transition-all">
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
        <div className="mb-6 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/50">
            Quản trị
          </h2>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          // exact match for /admin, prefix match for others like /admin/procedures
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "text-primary bg-primary/10 shadow-[inset_4px_0_0_0_hsl(var(--primary))]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:translate-x-1"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50 pointer-events-none" />
              )}
              <Icon 
                size={20} 
                className={clsx(
                  "transition-all duration-300", 
                  isActive ? "scale-110 text-primary drop-shadow-sm" : "group-hover:scale-110"
                )} 
              />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Profile Section at Bottom */}
      <div className="p-4 border-t border-border/50 bg-muted/10 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-secondary/80 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">Admin</span>
            <span className="text-xs font-medium text-muted-foreground">Quản trị viên</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

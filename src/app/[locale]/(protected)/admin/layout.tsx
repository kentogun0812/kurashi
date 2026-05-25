import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Settings, FileText, Users, LayoutDashboard, LogOut } from "lucide-react";
import { APP_INFO } from "@/const/type";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("common");

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/procedures", icon: FileText, label: "Procedures" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Top Admin Navbar (Fixed) */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border shadow-sm py-3 md:py-4 px-4 md:px-6 transition-all flex items-center justify-between">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 group transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <span className="text-white font-bold text-xl">{APP_INFO.name.charAt(0)}</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gradient hidden sm:block">
            {APP_INFO.name} Admin
          </span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Exit</span>
        </Link>
      </header>

      {/* Admin Sidebar (Fixed) */}
      <aside className="fixed top-[64px] md:top-[72px] bottom-0 left-0 w-64 bg-card border-r border-border hidden md:flex flex-col overflow-y-auto z-40">
        <nav className="flex-1 py-6 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 pt-[64px] md:pt-[72px] md:pl-64 flex flex-col min-h-screen w-full">
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

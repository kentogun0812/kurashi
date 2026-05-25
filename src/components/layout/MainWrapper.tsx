"use client";

import { usePathname } from "@/i18n/routing";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  return (
    <main className={isAdmin ? "flex-1 flex flex-col" : "flex-1 pt-[50px] md:pt-[60px] pb-12 flex flex-col"}>
      {children}
    </main>
  );
}

"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProcedureSearch() {
  const t = useTranslations("procedures");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Sync state with URL parameter (e.g. if cleared elsewhere)
  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }
    // Maintain current category when searching
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-full bg-background border-2 border-primary/20 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 shadow-sm hover:shadow-md group"
    >
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 h-14 md:h-16 bg-transparent pl-5 md:pl-6 pr-14 border-none outline-none text-base md:text-lg font-medium text-foreground placeholder-muted-foreground/70"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-14 md:w-16 h-14 md:h-16 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground transition-all shrink-0 border-l border-primary/20"
        title={t("searchPlaceholder")}
      >
        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Search size={24} className="group-focus-within:scale-110 transition-transform duration-300" />
        )}
      </button>
    </form>
  );
}

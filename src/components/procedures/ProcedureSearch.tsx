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
      className="relative flex items-center w-full bg-secondary/20 border border-border/40 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/40 transition-all duration-300 shadow-inner group"
    >
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 h-14 bg-transparent pl-5 pr-14 border-none outline-none text-sm md:text-base text-foreground placeholder-muted-foreground/60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-14 h-14 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground transition-all shrink-0 border-l border-border/20 rounded-r-2xl"
        title={t("searchPlaceholder")}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search size={20} />
        )}
      </button>
    </form>
  );
}

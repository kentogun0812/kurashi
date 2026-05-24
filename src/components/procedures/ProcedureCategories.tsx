"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { FullScreenLoading } from "@/components/ui/full-screen-loading";

export function ProcedureCategories() {
  const t = useTranslations("procedures");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categories = [
    { id: "all", label: t("categories.all"), queryValue: null },
    { id: "visa", label: t("categories.visa"), queryValue: "visa" },
    { id: "moving", label: t("categories.moving"), queryValue: "moving" },
    { id: "working", label: t("categories.working"), queryValue: "working" },
    { id: "marriage", label: t("categories.marriage"), queryValue: "marriage" },
    { id: "tax_insurance", label: t("categories.tax_insurance"), queryValue: "tax_insurance" },
    { id: "daily_life", label: t("categories.daily_life"), queryValue: "daily_life" },
  ];

  const handleCategoryClick = useCallback(
    (queryValue: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (queryValue) {
        params.set("category", queryValue);
      } else {
        params.delete("category");
      }
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const currentCategoryKey = searchParams.get("category") || "all";

  return (
    <>
      {isPending && <FullScreenLoading message={t("loading")} />}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide relative z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = currentCategoryKey === (cat.queryValue || "all");
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.queryValue)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary border border-border/50"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

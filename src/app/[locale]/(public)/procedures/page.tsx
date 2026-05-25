import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProcedureType } from "@/components/procedures/ProcedureCard";
import { ProcedureListItem } from "@/components/procedures/ProcedureListItem";
import { ProcedureSearch } from "@/components/procedures/ProcedureSearch";
import { ProcedureCategories } from "@/components/procedures/ProcedureCategories";
import { FileText, Inbox, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function ProceduresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("procedures");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  // Connect to Supabase
  const supabase = await createClient();
  let query = supabase.from("administrative_guides").select("*").order("title", { ascending: true });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  }

  const { data: dbGuides, error } = await query;

  if (error) {
    console.error("Error fetching administrative guides:", error);
  }

  // Category translation map
  const categoryMap: Record<string, string> = {
    visa: t("categories.visa"),
    moving: t("categories.moving"),
    working: t("categories.working"),
    marriage: t("categories.marriage"),
    tax_insurance: t("categories.tax_insurance"),
    daily_life: t("categories.daily_life"),
  };

  let procedures: ProcedureType[] = [];
  if (dbGuides) {
    procedures = dbGuides.map((g: any) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      category: g.category,
      categoryName: categoryMap[g.category] || g.category,
      summary: g.summary || "",
      lastVerifiedAt: g.last_verified_at
        ? new Date(g.last_verified_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A",
    }));
  }

  // Define logic for grouping
  const isAllCategory = !category || category === "all";
  const isSearching = !!q;

  // Group by category if we are viewing "All" and NOT searching
  const groupedProcedures: Record<string, ProcedureType[]> = {};
  if (isAllCategory && !isSearching) {
    procedures.forEach((proc) => {
      if (!groupedProcedures[proc.category]) {
        groupedProcedures[proc.category] = [];
      }
      groupedProcedures[proc.category].push(proc);
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4 text-foreground text-balance">
          {t("title")}{" "}
          <span className="text-primary text-gradient">
            {t("titleHighlight")}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6 w-full">
        <ProcedureSearch />
      </div>

      {/* Category Pills */}
      <ProcedureCategories />

      {/* Main Listing Section */}
      {procedures.length > 0 ? (
        isAllCategory && !isSearching ? (
          // Grouped Layout (when in "All" view without search)
          <div className="space-y-12">
            {Object.entries(groupedProcedures).map(([catKey, items]) => (
              <div key={catKey} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                  <div className="p-2 rounded-lg bg-primary/5 text-primary">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {categoryMap[catKey] || catKey}
                  </h2>
                  {items.length > 3 && (
                    <Link href={`/procedures?category=${catKey}`} className="ml-auto text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                      <span>{t("viewMore")}</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-3 md:gap-4">
                  {items.slice(0, 3).map((proc) => (
                    <ProcedureListItem key={proc.id} procedure={proc} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat List Layout (when filtering or searching)
          <div className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-300">
            {procedures.map((proc) => (
              <ProcedureListItem key={proc.id} procedure={proc} />
            ))}
          </div>
        )
      ) : (
        // Empty State
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-secondary/60 rounded-3xl flex items-center justify-center mb-6 text-primary shadow-inner">
            <Inbox size={36} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">
            {t("noResults")}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t("noResultsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}

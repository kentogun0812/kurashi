import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Plus, Edit, FileText } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { AdminSearchInput } from "@/components/admin/AdminSearchInput";
import { DeleteProcedureButton } from "@/components/admin/DeleteProcedureButton";

export const dynamic = "force-dynamic";

export default async function AdminProceduresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const t = await getTranslations("admin.procedures");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  
  // Fetch procedures
  let query = supabase
    .from("administrative_guides")
    .select("id, title, slug, category, last_verified_at")
    .order("last_verified_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  }

  const { data: procedures, error } = await query;

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'visa': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'moving': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'working': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'marriage': return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
      case 'tax_insurance': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-secondary text-secondary-foreground border-border/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <AdminSearchInput />
          <Link 
            href="/admin/procedures/create"
            className="inline-flex h-11 items-center justify-center gap-2 bg-primary text-primary-foreground px-5 rounded-xl font-medium hover:bg-primary/90 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus size={18} />
            {t("create")}
          </Link>
        </div>
      </div>

      <div className="glass border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/80 text-foreground/90 border-b-2 border-border/60">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">{t("list.title")}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">{t("list.category")}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">{t("list.lastUpdated")}</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">{t("list.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {procedures && procedures.length > 0 ? (
                procedures.map((proc) => (
                  <tr key={proc.id} className="group hover:bg-secondary/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {proc.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 truncate max-w-[300px]">
                        /{proc.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(proc.category)}`}>
                        {proc.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {proc.last_verified_at ? new Date(proc.last_verified_at).toLocaleDateString(locale) : tCommon("na")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/procedures/${proc.slug}/edit`}
                          className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all hover:scale-105"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        <DeleteProcedureButton id={proc.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p>{t("list.empty")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

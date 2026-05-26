import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Plus, Edit } from "lucide-react";
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

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">{t("list.title")}</th>
                <th className="px-6 py-3 font-semibold">{t("list.category")}</th>
                <th className="px-6 py-3 font-semibold">{t("list.lastUpdated")}</th>
                <th className="px-6 py-3 font-semibold text-right">{t("list.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {procedures && procedures.length > 0 ? (
                procedures.map((proc) => (
                  <tr key={proc.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {proc.title}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border/50">
                        {proc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {proc.last_verified_at ? new Date(proc.last_verified_at).toLocaleDateString(locale) : tCommon("na")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/procedures/${proc.slug}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </Link>
                        <DeleteProcedureButton id={proc.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    {t("list.empty")}
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

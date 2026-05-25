import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProceduresPage() {
  const supabase = await createClient();
  
  // Fetch procedures
  const { data: procedures, error } = await supabase
    .from("administrative_guides")
    .select("id, title, slug, category, last_verified_at")
    .order("last_verified_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Thủ tục</h1>
          <p className="text-muted-foreground text-sm">Quản lý danh sách các bài viết hướng dẫn hành chính</p>
        </div>
        <Link 
          href="/admin/procedures/create"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Tạo bài viết mới
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Tiêu đề</th>
                <th className="px-6 py-3 font-semibold">Danh mục</th>
                <th className="px-6 py-3 font-semibold">Cập nhật lần cuối</th>
                <th className="px-6 py-3 font-semibold text-right">Thao tác</th>
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
                      {proc.last_verified_at ? new Date(proc.last_verified_at).toLocaleDateString("vi-VN") : "N/A"}
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
                        <button 
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Chưa có bài viết nào.
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

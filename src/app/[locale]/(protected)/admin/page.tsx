import { getTranslations } from "next-intl/server";
import { getDashboardStats } from "@/services/admin.service";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return {
    title: `Dashboard - ${t("dashboard", { fallback: "Admin" })}`,
  };
}

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Thống kê tổng quan về tình trạng hoạt động của hệ thống Kurashi.
        </p>
      </div>
      
      {/* Overview Cards */}
      <DashboardStats stats={stats} />

      {/* Analytics Charts */}
      <DashboardCharts />
    </div>
  );
}

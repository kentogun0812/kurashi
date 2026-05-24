import { Link } from "@/i18n/routing";
import { FileText, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcedureType {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  summary: string;
  lastVerifiedAt: string;
}

interface ProcedureCardProps {
  procedure: ProcedureType;
}

export function ProcedureCard({ procedure }: ProcedureCardProps) {
  // Category color mapping
  const categoryColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    visa: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20 dark:border-purple-500/30",
      glow: "hover:shadow-purple-500/5",
    },
    moving: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 dark:border-blue-500/30",
      glow: "hover:shadow-blue-500/5",
    },
    working: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      glow: "hover:shadow-emerald-500/5",
    },
    marriage: {
      bg: "bg-pink-500/10 dark:bg-pink-500/20",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-500/20 dark:border-pink-500/30",
      glow: "hover:shadow-pink-500/5",
    },
    tax_insurance: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20 dark:border-amber-500/30",
      glow: "hover:shadow-amber-500/5",
    },
    daily_life: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20 dark:border-indigo-500/30",
      glow: "hover:shadow-indigo-500/5",
    },
  };

  const colors = categoryColors[procedure.category] || {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/20 dark:border-slate-500/30",
    glow: "hover:shadow-slate-500/5",
  };

  return (
    <Link
      href={`/procedures/${procedure.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md",
        colors.glow
      )}
    >
      {/* Background soft glow on hover */}
      <div className="absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
      
      <div>
        {/* Header: Category Badge and Verified Badge */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-xl border px-3 py-1 text-xs font-bold transition-colors",
              colors.bg,
              colors.text,
              colors.border
            )}
          >
            {procedure.categoryName}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-lg">
            <CheckCircle size={12} className="text-emerald-500" />
            <span>Chính xác</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {procedure.title}
        </h3>

        {/* Summary */}
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {procedure.summary}
        </p>
      </div>

      {/* Footer: Date and CTA */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} />
          <span>{procedure.lastVerifiedAt}</span>
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-1">
          <span>Xem chi tiết</span>
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

import { Link } from "@/i18n/routing";
import { Calendar, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProcedureType } from "./ProcedureCard";

interface ProcedureListItemProps {
  procedure: ProcedureType;
}

export function ProcedureListItem({ procedure }: ProcedureListItemProps) {
  // Category color mapping
  const categoryColors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    visa: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/20 dark:border-purple-500/30",
      hover: "hover:border-purple-500/40 hover:bg-purple-500/5",
    },
    moving: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 dark:border-blue-500/30",
      hover: "hover:border-blue-500/40 hover:bg-blue-500/5",
    },
    working: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      hover: "hover:border-emerald-500/40 hover:bg-emerald-500/5",
    },
    marriage: {
      bg: "bg-pink-500/10 dark:bg-pink-500/20",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-500/20 dark:border-pink-500/30",
      hover: "hover:border-pink-500/40 hover:bg-pink-500/5",
    },
    tax_insurance: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20 dark:border-amber-500/30",
      hover: "hover:border-amber-500/40 hover:bg-amber-500/5",
    },
    daily_life: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20 dark:border-indigo-500/30",
      hover: "hover:border-indigo-500/40 hover:bg-indigo-500/5",
    },
  };

  const colors = categoryColors[procedure.category] || {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/20 dark:border-slate-500/30",
    hover: "hover:border-slate-500/40 hover:bg-slate-500/5",
  };

  return (
    <Link
      href={`/procedures/${procedure.slug}`}
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-border/60 bg-card transition-all duration-200 shadow-sm",
        colors.hover
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {procedure.title}
          </h3>
          {/* <span className="shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/20">
            <CheckCircle size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Chính xác</span>
          </span> */}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {procedure.summary}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:min-w-[140px] mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/50 sm:border-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={13} />
          <span>{procedure.lastVerifiedAt}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

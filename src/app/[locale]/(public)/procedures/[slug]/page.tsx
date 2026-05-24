import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  FileText, 
  ChevronRight, 
  ClipboardList, 
  FolderOpen 
} from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

interface Step {
  id: string;
  step_number: number;
  title: string;
  description: string;
  required_documents: string[];
}

// Simple safe markdown parser helper that returns React nodes directly without dangerouslySetInnerHTML
function parseBold(text: string): React.ReactNode[] {
  const parts = text.split("**");
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdown(content: string) {
  if (!content) return null;

  const lines = content.split("\n");
  let inList = false;
  const listItems: React.ReactNode[] = [];
  const elements: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-6 my-4 space-y-2 text-muted-foreground leading-relaxed text-sm md:text-base">
          {[...listItems]}
        </ul>
      );
      listItems.length = 0;
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === "---") {
      flushList(`hr-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-6 border-border" />);
      return;
    }

    // Headers
    if (trimmed.startsWith("## ")) {
      flushList(`h2-${index}`);
      const text = parseBold(trimmed.substring(3));
      elements.push(
        <h3 key={`h2-${index}`} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-3">
          {text}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(`h3-${index}`);
      const text = parseBold(trimmed.substring(4));
      elements.push(
        <h4 key={`h3-${index}`} className="text-base md:text-lg font-bold text-foreground mt-6 mb-3">
          {text}
        </h4>
      );
      return;
    }

    // Bullet lists
    if (trimmed.startsWith("- ")) {
      inList = true;
      const text = parseBold(trimmed.substring(2));
      listItems.push(<li key={`li-${index}`}>{text}</li>);
      return;
    }

    // Paragraph or empty line
    if (trimmed === "") {
      flushList(`empty-${index}`);
    } else {
      if (inList) {
        flushList(`flush-${index}`);
      }
      const text = parseBold(trimmed);
      elements.push(
        <p key={`p-${index}`} className="text-muted-foreground leading-relaxed my-4 text-sm md:text-base">
          {text}
        </p>
      );
    }
  });

  flushList("end");
  return <div className="space-y-1">{elements}</div>;
}

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("procedures");

  // Fetch guide detail from Supabase
  const supabase = await createClient();
  const { data: guide, error: guideError } = await supabase
    .from("administrative_guides")
    .select("*")
    .eq("slug", slug)
    .single();

  if (guideError || !guide) {
    console.error("Error fetching guide:", guideError);
    notFound();
  }

  // Fetch steps
  const { data: stepsData, error: stepsError } = await supabase
    .from("administrative_steps")
    .select("*")
    .eq("guide_id", guide.id)
    .order("step_number", { ascending: true });

  if (stepsError) {
    console.error("Error fetching steps:", stepsError);
  }

  const steps: Step[] = (stepsData || []).map((s: any) => ({
    id: s.id,
    step_number: s.step_number,
    title: s.title,
    description: s.description || "",
    required_documents: Array.isArray(s.required_documents) ? s.required_documents : [],
  }));

  // Category translate map
  const categoryMap: Record<string, string> = {
    visa: t("categories.visa"),
    moving: t("categories.moving"),
    working: t("categories.working"),
    marriage: t("categories.marriage"),
    tax_insurance: t("categories.tax_insurance"),
    daily_life: t("categories.daily_life"),
  };

  const formattedDate = guide.last_verified_at
    ? new Date(guide.last_verified_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/procedures"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>{t("backToList")}</span>
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        {/* Left column: main content (3/4 on desktop) */}
        <div className="lg:col-span-3 space-y-8 md:space-y-12">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-bold text-primary">
                {categoryMap[guide.category] || guide.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={13} />
                <span>{t("lastVerified", { date: formattedDate })}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                <CheckCircle size={12} />
                <span>{t("verified")}</span>
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {guide.title}
            </h1>
            
            {guide.summary && (
              <p className="text-base md:text-lg text-muted-foreground border-l-4 border-border pl-4 italic">
                {guide.summary}
              </p>
            )}
          </div>

          <hr className="border-border/50" />

          {/* Guide Markdown Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {renderMarkdown(guide.content_md)}
          </div>

          {/* Steps Section */}
          {steps.length > 0 && (
            <div className="space-y-8 pt-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <ClipboardList className="text-primary" size={24} />
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {t("steps")}
                </h2>
              </div>

              <div className="relative border-l border-border/80 pl-6 md:pl-8 ml-3 md:ml-4 space-y-12">
                {steps.map((step, idx) => (
                  <div key={step.id} className="relative group">
                    {/* Circle timeline pin */}
                    <div className="absolute -left-[35px] md:-left-[43px] top-1.5 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-xs md:text-sm font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-md">
                      {step.step_number}
                    </div>

                    {/* Step Title */}
                    <div className="space-y-3">
                      <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      
                      {/* Step Description */}
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>

                      {/* Required Documents */}
                      {step.required_documents.length > 0 && (
                        <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-4 animate-in fade-in duration-300">
                          <h4 className="mb-3 flex items-center gap-2 text-xs md:text-sm font-bold text-foreground">
                            <FolderOpen size={16} className="text-primary" />
                            <span>{t("requiredDocs")}</span>
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {step.required_documents.map((doc, docIdx) => (
                              <li
                                key={docIdx}
                                className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground"
                              >
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Sticky Navigation / TOC (1/4 on desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-[100px] space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {t("tableOfContents")}
              </h3>
              
              <nav className="space-y-1.5">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <ChevronRight size={14} className="text-primary" />
                  <span>Giới thiệu</span>
                </a>
                
                {steps.map((step) => (
                  <a
                    key={step.id}
                    href={`#step-${step.step_number}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <span className="text-xs font-bold text-primary w-4">
                      {step.step_number}.
                    </span>
                    <span className="truncate">{step.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
const ProcedureEditor = dynamic(() => import("@/components/admin/ProcedureEditor").then(mod => mod.ProcedureEditor), { ssr: false });
import { ArrowLeft, Save, Loader2, Globe, ChevronDown, Check } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Locale = "vi" | "en" | "jp";

export default function EditProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const t = useTranslations("procedures.categories");
  const tAdmin = useTranslations("admin.procedures");
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<Locale>("vi");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [procedureId, setProcedureId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: "",
    category: "visa",
    title: { vi: "", en: "", jp: "" },
    summary: { vi: "", en: "", jp: "" },
    content: { vi: "", en: "", jp: "" },
  });

  const categories = [
    { id: "visa", label: t("visa") },
    { id: "moving", label: t("moving") },
    { id: "working", label: t("working") },
    { id: "marriage", label: t("marriage") },
    { id: "tax_insurance", label: t("tax_insurance") },
    { id: "daily_life", label: t("daily_life") },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchProcedure() {
      try {
        const { data, error } = await supabase
          .from("administrative_guides")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        if (data) {
          setProcedureId(data.id);
          setFormData({
            slug: data.slug,
            category: data.category,
            title: { vi: data.title || "", en: data.title_en || "", jp: data.title_jp || "" },
            summary: { vi: data.summary || "", en: data.summary_en || "", jp: data.summary_jp || "" },
            content: { vi: data.content_md || "", en: data.content_md_en || "", jp: data.content_md_jp || "" },
          });
        }
      } catch (err: any) {
        console.error("Error fetching procedure:", err);
        alert(`${tAdmin("editPage.fetchError")} ${err.message}`);
        router.push("/admin/procedures");
      } finally {
        setIsFetching(false);
      }
    }

    if (slug) {
      fetchProcedure();
    }
  }, [slug, supabase, router, tAdmin]);

  const handleTextChange = (locale: Locale, field: "title" | "summary", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value }
    }));
  };

  const handleContentChange = (locale: Locale, value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [locale]: value || "" }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.vi || !formData.slug || !formData.content.vi) {
      alert("Please fill in at least the Title, Slug, and Content for the primary language (vi)!");
      return;
    }
    
    if (!procedureId) return;

    setIsSubmitting(true);
    try {
      // 1. Validate Duplicate Slug (ignore if it's the current procedure's slug)
      if (formData.slug !== slug) {
        const { data: existingSlug } = await supabase
          .from("administrative_guides")
          .select("id")
          .eq("slug", formData.slug)
          .single();
          
        if (existingSlug) {
          alert("This slug already exists. Please choose a unique slug.");
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Update Data
      const { error } = await supabase.from("administrative_guides")
        .update({
          slug: formData.slug,
          category: formData.category,
          title: formData.title.vi,
          title_en: formData.title.en,
          title_jp: formData.title.jp,
          summary: formData.summary.vi,
          summary_en: formData.summary.en,
          summary_jp: formData.summary.jp,
          content_md: formData.content.vi,
          content_md_en: formData.content.en,
          content_md_jp: formData.content.jp,
        })
        .eq("id", procedureId);

      if (error) throw error;
      router.push("/admin/procedures");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating procedure:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: Locale; label: string }[] = [
    { id: "vi", label: "Tiếng Việt" },
    { id: "en", label: "English" },
    { id: "jp", label: "日本語" },
  ];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/procedures" className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{tAdmin("editPage.title")}</h1>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {tAdmin("editPage.submit")}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Global Settings */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
              <Globe size={20} className="text-primary" />
              {tAdmin("createPage.settings")}
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">{tAdmin("createPage.slug")}</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                placeholder={tAdmin("createPage.slugPlaceholder")}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-secondary/20 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tAdmin("createPage.slugDesc")}
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">{tAdmin("createPage.category")}</label>
              
              {/* Custom Modern Dropdown */}
              <div className="relative w-full" ref={dropdownRef}>
                <button 
                  type="button" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 bg-secondary/20 border border-border/60 rounded-xl h-12 text-sm text-foreground hover:bg-background/80 transition-colors outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                >
                  <span className="truncate font-medium">
                    {categories.find(c => c.id === formData.category)?.label}
                  </span>
                  <ChevronDown size={16} className={`text-muted-foreground ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-border/80 shadow-2xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[280px] overflow-y-auto p-1.5 custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, category: cat.id }));
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center p-3 rounded-lg text-left text-sm transition-colors ${formData.category === cat.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary text-foreground font-medium'}`}
                        >
                          <span className="flex-1">{cat.label}</span>
                          {formData.category === cat.id && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Multilingual Content */}
        <div className="xl:col-span-3 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border bg-secondary/30 px-2 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3.5 text-sm font-semibold transition-colors rounded-t-xl overflow-hidden border-t border-x ${
                  activeTab === tab.id 
                    ? "text-primary bg-background border-border shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent"
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content per Locale */}
          <div className="p-6 md:p-8 space-y-8 flex-1 bg-background">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">{tAdmin("createPage.articleTitle")}</label>
              <input
                type="text"
                value={formData.title[activeTab]}
                onChange={(e) => handleTextChange(activeTab, "title", e.target.value)}
                placeholder={`${tAdmin("createPage.articleTitlePlaceholder")} (${activeTab.toUpperCase()})`}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-secondary/10 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg font-semibold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">{tAdmin("createPage.summary")}</label>
              <textarea
                value={formData.summary[activeTab]}
                onChange={(e) => handleTextChange(activeTab, "summary", e.target.value)}
                placeholder={tAdmin("createPage.summaryPlaceholder")}
                rows={3}
                className="w-full p-4 rounded-xl border border-border/60 bg-secondary/10 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>{tAdmin("createPage.content")}</span>
              </label>
              {/* Force re-render of ProcedureEditor when activeTab changes to prevent cache bugs */}
              <div key={activeTab}>
                <ProcedureEditor 
                  value={formData.content[activeTab]} 
                  onChange={(val) => handleContentChange(activeTab, val)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

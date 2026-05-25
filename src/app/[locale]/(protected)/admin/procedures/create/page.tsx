"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
const ProcedureEditor = dynamic(() => import("@/components/admin/ProcedureEditor").then(mod => mod.ProcedureEditor), { ssr: false });
import { ArrowLeft, Save, Loader2, Globe, ChevronDown, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Locale = "vi" | "en" | "jp";

export default function CreateProcedurePage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("procedures.categories");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>("vi");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      alert("Vui lòng điền ít nhất Tiêu đề, Slug và Nội dung cho tiếng Việt!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Validate Duplicate Slug
      const { data: existingSlug } = await supabase
        .from("administrative_guides")
        .select("id")
        .eq("slug", formData.slug)
        .single();
        
      if (existingSlug) {
        alert("Đường dẫn (Slug) này đã tồn tại trong hệ thống. Vui lòng đặt một slug khác!");
        setIsSubmitting(false);
        return;
      }

      // 2. Insert Data
      const { error } = await supabase.from("administrative_guides").insert({
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
      });

      if (error) throw error;
      
      router.push("/admin/procedures");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating procedure:", error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: Locale; label: string }[] = [
    { id: "vi", label: "Tiếng Việt" },
    { id: "en", label: "English" },
    { id: "jp", label: "日本語" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/procedures" className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tạo Bài viết mới</h1>
            <p className="text-sm text-muted-foreground">Thêm thủ tục hành chính mới vào hệ thống</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Lưu bài viết
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Global Settings */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
              <Globe size={20} className="text-primary" />
              Cài đặt chung
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">URL Slug (Đường dẫn)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                placeholder="VD: dang-ky-visa-kisu"
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-secondary/20 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dùng tiếng Việt không dấu, nối nhau bằng dấu gạch ngang (chỉ chứa a-z, 0-9 và -).
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Danh mục</label>
              
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
                className={`relative px-6 py-3.5 text-sm font-semibold transition-all rounded-t-xl overflow-hidden ${
                  activeTab === tab.id 
                    ? "text-primary bg-background border-t border-x border-border shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]" 
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
              <label className="text-sm font-semibold text-foreground">Tiêu đề bài viết</label>
              <input
                type="text"
                value={formData.title[activeTab]}
                onChange={(e) => handleTextChange(activeTab, "title", e.target.value)}
                placeholder={`Nhập tiêu đề (${activeTab.toUpperCase()})`}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-secondary/10 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg font-semibold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Tóm tắt ngắn (Summary)</label>
              <textarea
                value={formData.summary[activeTab]}
                onChange={(e) => handleTextChange(activeTab, "summary", e.target.value)}
                placeholder="Tóm tắt nội dung chính sẽ hiển thị ở đầu trang..."
                rows={3}
                className="w-full p-4 rounded-xl border border-border/60 bg-secondary/10 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>Nội dung chi tiết (Markdown)</span>
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

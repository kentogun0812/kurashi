'use client';

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Loader2 } from "lucide-react";

export function EventCategories() {
  const t = useTranslations('events');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const [isPending, startTransition] = useTransition();

  const categories = [
    { id: 'all', label: t('categories.all'), queryValue: null },
    { id: 'festival', label: t('categories.festival'), queryValue: 'festival' },
    { id: 'job', label: t('categories.job'), queryValue: 'job' },
    { id: 'sports', label: t('categories.sports'), queryValue: 'sports' },
    { id: 'exchange', label: t('categories.exchange'), queryValue: 'exchange' },
    { id: 'workshop', label: t('categories.workshop'), queryValue: 'workshop' },
    { id: 'academic', label: t('categories.academic'), queryValue: 'academic' },
    { id: 'other', label: t('categories.other'), queryValue: 'other' }
  ];

  const handleCategoryClick = useCallback((queryValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (queryValue) {
      params.set('category', queryValue);
    } else {
      params.delete('category');
    }
    // Remove legacy cat_id if present
    params.delete('cat_id');
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  const currentCategoryKey = searchParams.get('category') || 'all';

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
           <div className="flex flex-col items-center bg-card p-6 rounded-2xl shadow-2xl border border-border">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="font-semibold text-foreground">Đang tải danh mục...</p>
           </div>
        </div>
      )}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide relative z-10">
      {categories.map((cat) => {
        const isActive = currentCategoryKey === (cat.queryValue || 'all');
        return (
          <button 
            key={cat.id} 
            onClick={() => handleCategoryClick(cat.queryValue)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
      </div>
    </>
  );
}

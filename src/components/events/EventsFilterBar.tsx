'use client';

import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, ChevronDown, ChevronRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect, useTransition, useRef } from "react";
import { EventForm } from "@/components/events/EventForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

interface Region {
  id: string;
  slug: string;
  name: string;
  type: string;
  parent_slug: string | null;
}

interface RegionHierarchy {
  [key: string]: {
    region: Region;
    cities: Region[];
  }
}

export function EventsFilterBar() {
  const t = useTranslations('events');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [regionsData, setRegionsData] = useState<RegionHierarchy>({});
  const [isDictLoading, setIsDictLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentRegionParam = searchParams.get('region') || 'all';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    async function fetchRegions() {
      setIsDictLoading(true);
      const supabase = createClient();
      const { data } = await supabase.from('regions').select('*').order('type', { ascending: false }); // region then prefecture
      
      if (data) {
        const hierarchy: RegionHierarchy = {};
        
        // Find regions
        data.filter(r => r.type === 'region').forEach(r => {
          hierarchy[r.slug] = {
            region: {
              ...r,
              name: locale === 'vi' ? r.name_vi : locale === 'jp' ? r.name_jp : r.name_en
            },
            cities: []
          };
        });
        
        // Match cities
        data.filter(r => r.type === 'prefecture' || r.type === 'city').forEach(r => {
          if (r.parent_slug && hierarchy[r.parent_slug]) {
            hierarchy[r.parent_slug].cities.push({
              ...r,
              name: locale === 'vi' ? r.name_vi : locale === 'jp' ? r.name_jp : r.name_en
            });
          }
        });
        setRegionsData(hierarchy);
      }
      setIsDictLoading(false);
    }
    fetchRegions();
  }, [locale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (searchTerm !== currentQ) {
        startTransition(() => {
          router.push(`${pathname}?${createQueryString('q', searchTerm)}`);
        });
      }
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams, createQueryString]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`${pathname}?${createQueryString('q', searchTerm)}`);
    });
  };

  const handleRegionChange = (val: string) => {
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push(`${pathname}?${createQueryString('region', val)}`);
    });
  };

  const handleCreateEventClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?next=/events');
      return;
    }
    
    setIsModalOpen(true);
  };

  // Getting proper display name for current selection
  let displayTitle = t('regions.all');
  if (currentRegionParam !== 'all') {
    // try find in fetched data
    let found = false;
    for (const key of Object.keys(regionsData)) {
      if (regionsData[key].region.slug === currentRegionParam) {
        displayTitle = regionsData[key].region.name;
        found = true;
        break;
      }
      const cityMatch = regionsData[key].cities.find(c => c.slug === currentRegionParam);
      if (cityMatch) {
        displayTitle = cityMatch.name;
        found = true;
        break;
      }
    }
    if (!found) {
      // fallback
      displayTitle = currentRegionParam.charAt(0).toUpperCase() + currentRegionParam.slice(1);
    }
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
           <div className="flex flex-col items-center bg-card p-6 rounded-2xl shadow-2xl border border-border">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="font-semibold text-foreground">Đang tải dữ liệu...</p>
           </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 mb-10 bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 relative z-10">
        <form onSubmit={handleSearch} className="flex w-full lg:w-2/3 items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-background/50 border-border/50 rounded-2xl h-12 text-md w-full"
            />
          </div>
          
          {/* Custom Region Dropdown */}
          <div className="relative hidden md:block w-64 shrink-0" ref={dropdownRef}>
            <button 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between pl-12 pr-4 py-3 bg-background/50 border border-border/50 rounded-2xl h-12 text-sm text-foreground hover:bg-background/80 transition-colors outline-none focus:ring-2 focus:ring-ring"
            >
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <span className="truncate font-medium">
                  {displayTitle}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-14 right-0 w-72 bg-card border border-border shadow-2xl rounded-2xl p-2 z-50 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <button 
                   onClick={() => handleRegionChange('all')}
                   className={`w-full flex items-center p-3 rounded-xl text-left text-sm transition-colors ${currentRegionParam === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary text-foreground'}`}
                >
                  <span className="flex-1">{t('regions.all')}</span>
                  {currentRegionParam === 'all' && <Check size={16} />}
                </button>
                <div className="my-2 border-t border-border/50" />
                
                {isDictLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : (
                  Object.values(regionsData).map(({ region, cities }) => (
                    <div key={region.slug} className="mb-2">
                      <button
                        onClick={() => handleRegionChange(region.slug)}
                        className={`w-full flex items-center p-3 rounded-xl text-left transition-colors group ${currentRegionParam === region.slug ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary/50 text-foreground'}`}
                      >
                        <span className="flex-1 font-semibold">{region.name}</span>
                        {currentRegionParam === region.slug ? <Check size={16} className="text-primary"/> : <ChevronRight size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100" />}
                      </button>
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-secondary pl-2">
                        {cities.map((city) => (
                           <button
                             key={city.slug}
                             onClick={() => handleRegionChange(city.slug)}
                             className={`w-full flex items-center p-2 rounded-lg text-left text-sm transition-colors ${currentRegionParam === city.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                           >
                             <span className="flex-1">{city.name}</span>
                             {currentRegionParam === city.slug && <Check size={14} className="text-primary" />}
                           </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </form>
      
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button variant="outline" className="w-full lg:w-auto rounded-2xl h-12 border-border/50 gap-2 font-semibold hover:bg-secondary">
            <Filter size={18} />
            {t('filter')}
          </Button>
          <Button 
            onClick={handleCreateEventClick}
            className="w-full lg:w-auto rounded-2xl h-12 gap-2 font-semibold glow-primary shadow-lg"
          >
            {t('createEvent')}
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] p-0 border-none bg-transparent shadow-none" showCloseButton={false}>
              <div className="bg-background rounded-2xl p-2 md:p-4 shadow-xl border border-border">
                <EventForm 
                  className="space-y-6 bg-card/60 backdrop-blur-md p-4 md:p-6 rounded-3xl"
                  onSuccess={() => setIsModalOpen(false)}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

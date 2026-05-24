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
import { FullScreenLoading } from "@/components/ui/full-screen-loading";

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
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('type', { ascending: false });
      
      if (error) {
        console.error('Error fetching regions:', error.message);
        setIsDictLoading(false);
        return;
      }
      
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

  // Auto search removed based on user request - search now happens on button click or Enter key


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
        <FullScreenLoading message={t('loading')} />
      )}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 p-4 md:p-5 mb-8 md:mb-10 bg-card/40 backdrop-blur-md rounded-2xl md:rounded-3xl border border-border/50 relative z-40">
        <form id="search-form" onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full lg:flex-1 items-stretch sm:items-center gap-3">
          {/* Custom Region Dropdown - First on the left */}
          <div className="relative w-full sm:w-56 shrink-0" ref={dropdownRef}>
            <button 
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between pl-12 pr-4 bg-background/50 border border-border/50 rounded-xl md:rounded-2xl h-12 text-sm text-foreground hover:bg-background/80 transition-colors outline-none focus:ring-2 focus:ring-ring"
            >
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <span className="truncate font-medium">
                  {displayTitle}
                </span>
                <ChevronDown size={16} className={`text-muted-foreground ml-2 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-border/80 shadow-2xl rounded-2xl z-60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
                <div className="max-h-[350px] overflow-y-auto p-1.5 custom-scrollbar border-b border-border/50">
                  <button 
                     onClick={() => handleRegionChange('all')}
                     className={`w-full flex items-center p-3 rounded-xl text-left text-sm transition-colors ${currentRegionParam === 'all' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-secondary text-foreground'}`}
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
              </div>
            )}
          </div>

          <div className="flex items-center w-full bg-secondary/20 border border-border/40 rounded-xl md:rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/40 transition-all duration-300 shadow-inner group">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 h-12 bg-transparent pl-4 pr-12 border-none outline-none text-sm text-foreground placeholder-muted-foreground/60"
            />
            <button 
              type="submit"
              className="w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground transition-all shrink-0 border-l border-border/20 rounded-r-xl md:rounded-r-2xl"
              title={t('search')}
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            onClick={handleCreateEventClick}
            className="w-full sm:w-auto rounded-xl md:rounded-2xl h-12 gap-2 font-semibold glow-primary shadow-lg px-6"
          >
            {t('createEvent')}
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] w-[95vw] p-0 border border-border bg-background rounded-[2rem] shadow-2xl z-[150] overflow-hidden flex flex-col" showCloseButton={false}>
              <div className="overflow-y-auto flex-1 custom-scrollbar p-1">
                <EventForm 
                  className="space-y-6 p-5 md:p-10"
                  onSuccess={() => {
                    setIsModalOpen(false);
                    startTransition(() => {
                      router.refresh();
                    });
                  }}
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

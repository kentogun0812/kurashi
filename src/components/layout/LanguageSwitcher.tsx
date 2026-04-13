"use client";
import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Languages, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLocaleChange = (newLocale: string) => {
    // @ts-expect-error - next-intl types can be tricky with dynamic segments
    router.replace({ pathname, params }, { locale: newLocale });
  };

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "jp", name: "日本語", flag: "🇯🇵" },
  ];

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-2 h-10 px-3 rounded-xl hover:bg-secondary transition-colors"
        )}
      >
        <Languages size={18} className="text-primary" />
        <span className="font-semibold text-sm hidden sm:inline-block">
          {currentLanguage.name}
        </span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-border/50 bg-background/95 backdrop-blur-md">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className="flex items-center gap-3 rounded-xl px-4 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
          >
            {/* <span className="text-lg">{lang.flag}</span> */}
            <span className={lang.code === locale ? "font-bold text-primary" : "font-medium"}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

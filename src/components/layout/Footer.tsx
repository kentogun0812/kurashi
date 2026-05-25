"use client";
import { Link, usePathname } from "@/i18n/routing";
import { Mail, MapPin, Phone } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";
import { APP_INFO, CONTACT_INFO, SOCIAL_LINKS } from "@/const/type";

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const pathname = usePathname();

  // Hide Footer on Admin pages
  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <footer className="bg-background border-t border-border mt-20 pt-16 pb-12 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <span className="text-white font-bold text-sm">{APP_INFO.name.charAt(0)}</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gradient">
                {APP_INFO.name}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t('slogan')}
            </p>
            {/* <div className="flex items-center gap-4 mt-2">
              <Link href={SOCIAL_LINKS.facebook} className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.facebook size={20} />
              </Link>
              <Link href={SOCIAL_LINKS.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icons.instagram size={20} />
              </Link>
            </div> */}
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">{t('support')}</h4>
            <ul className="flex flex-col gap-2">
              {/* <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li> */}
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-foreground">{t('contact')}</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-primary mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-primary" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col items-center text-center md:flex-row md:justify-between md:text-left gap-4 mb-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_INFO.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs text-muted-foreground italic">
              {t('madeWith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

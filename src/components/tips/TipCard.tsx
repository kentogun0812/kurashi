import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { LifeTip } from '@/services/tips.service';

interface TipCardProps {
  tip: LifeTip;
  locale: string;
}

export function TipCard({ tip, locale }: TipCardProps) {
  const tipTitle = locale === 'en' && tip.title_en ? tip.title_en : locale === 'jp' && tip.title_jp ? tip.title_jp : tip.title;
  const tipSummary = locale === 'en' && tip.summary_en ? tip.summary_en : locale === 'jp' && tip.summary_jp ? tip.summary_jp : tip.summary;
  
  const formattedDate = new Date(tip.created_at).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Link href={`/tips/${tip.slug}`} className="block h-full group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md border-border/50 bg-card/60 backdrop-blur-sm group-hover:border-primary/30 flex flex-col">
        {tip.thumbnail_url && (
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <Image
              src={tip.thumbnail_url}
              alt={tipTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-1 bg-yellow-500/10 text-yellow-600 rounded-md">
              {tip.category}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {formattedDate}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2" title={tipTitle}>
            {tipTitle}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-grow">
            {tipSummary}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tip.tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-sm">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

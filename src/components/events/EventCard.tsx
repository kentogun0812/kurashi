import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface EventType {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string;
  attendees: number;
  organizer: string;
}

interface EventCardProps {
  event: EventType;
  priority?: boolean;
}

export function EventCard({ event, priority }: EventCardProps) {
  const t = useTranslations('events');
  const tNav = useTranslations('nav');

  return (
    <Card className="overflow-hidden group bg-card/60 backdrop-blur-md border-border/60 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(152,72,255,0.15)] flex flex-col h-full rounded-3xl">
      <CardHeader className="p-0 relative h-52 overflow-hidden shrink-0">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />
        
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow-sm font-medium hover:bg-background/90">
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2.5 mb-2 mt-auto">
          <div className="flex items-center text-muted-foreground text-sm gap-2.5">
            <Calendar size={18} className="text-primary/80 shrink-0" />
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm gap-2.5">
            <MapPin size={18} className="text-primary/80 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm gap-2.5">
            <Users size={18} className="text-primary/80 shrink-0" />
            <span>{t('attendees', { count: event.attendees })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
        <div className="text-sm text-muted-foreground flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-foreground">{event.organizer.charAt(0)}</span>
          </div>
          <span className="truncate max-w-[120px]">{event.organizer}</span>
        </div>
        <Link 
          href={`/events/${event.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary font-semibold hover:text-primary hover:bg-primary/10 rounded-xl")}
        >
          {tNav('details')}
        </Link>
      </CardFooter>
    </Card>
  );
}

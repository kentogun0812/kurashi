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
  organizerAvatar?: string;
}

interface EventCardProps {
  event: EventType;
  priority?: boolean;
}

export function EventCard({ event, priority }: EventCardProps) {
  const t = useTranslations('events');
  const tNav = useTranslations('nav');

  return (
    <Card className="overflow-hidden group bg-card/60 backdrop-blur-md border-border/60 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(152,72,255,0.15)] flex flex-col h-full rounded-[1.5rem] max-w-[350px]">
      <CardHeader className="p-0 relative h-48 overflow-hidden shrink-0">
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
        
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow-sm font-medium hover:bg-background/90 text-[10px] h-6 px-2">
            {event.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-2 mt-auto">
          <div className="flex items-center text-muted-foreground text-[13px] gap-2">
            <Calendar size={14} className="text-primary/80 shrink-0" />
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-[13px] gap-2">
            <MapPin size={14} className="text-primary/80 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-[13px] gap-2">
            <Users size={14} className="text-primary/80 shrink-0" />
            <span>{t('attendees', { count: event.attendees })}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
        <div className="text-[13px] text-muted-foreground flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
            {event.organizerAvatar ? (
              <Image 
                src={event.organizerAvatar} 
                alt={event.organizer} 
                width={24} 
                height={24} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-[10px] uppercase font-bold text-foreground">{event.organizer.charAt(0)}</span>
            )}
          </div>
          <span className="truncate max-w-[100px] font-medium">{event.organizer}</span>
        </div>
        <Link 
          href={`/events/${event.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary text-[13px] font-semibold hover:text-primary hover:bg-primary/10 rounded-xl h-8 px-3")}
        >
          {tNav('details')}
        </Link>
      </CardFooter>
    </Card>
  );
}

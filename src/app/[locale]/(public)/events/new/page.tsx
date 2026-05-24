import { EventForm } from "@/components/events/EventForm";
import { APP_INFO } from "@/const/type";
import { getTranslations } from "next-intl/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'events' });
  
  return {
    title: `Create Event | ${APP_INFO.name}`,
    description: "Share your upcoming event with the community in Japan",
  };
}

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link 
          href="/events"
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2 text-muted-foreground hover:text-foreground")}
        >
          <ChevronLeft size={16} />
          Quay lại danh sách
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <EventForm />
      </div>
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullScreenLoadingProps {
  message?: string;
  className?: string;
}

export function FullScreenLoading({ message, className }: FullScreenLoadingProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300",
      className
    )}>
      <div className="relative w-20 h-20 mb-6">
        <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
        <Loader2 className="h-20 w-20 animate-spin text-primary absolute inset-0 [animation-duration:1.5s]" />
      </div>
      {message && (
        <p className="font-bold text-xl text-foreground tracking-tight animate-pulse text-center px-4">
          {message}
        </p>
      )}
    </div>
  );
}

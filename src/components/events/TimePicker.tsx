'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string; // ISO string or just "HH:mm"
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const date = value ? new Date(value) : new Date();
  const hours = date.getHours();
  const minutes = Math.floor(date.getMinutes() / 5) * 5;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (h: number, m: number) => {
    const newDate = new Date(date);
    newDate.setHours(h);
    newDate.setMinutes(m);
    onChange(newDate.toISOString());
  };

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-semibold ml-1">Giờ</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full relative flex items-center justify-between px-4 bg-secondary/30 border border-border/50 rounded-xl h-12 text-sm text-foreground hover:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="font-medium">{formattedTime}</span>
        <Clock size={16} className="text-muted-foreground opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-[180px] bg-background border border-border shadow-2xl rounded-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-2">
          <div className="flex gap-1 h-40">
            {/* Hours */}
            <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
              {Array.from({ length: 24 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTimeChange(i, minutes)}
                  className={cn(
                    "w-full py-1.5 text-[11px] rounded-md transition-all mb-0.5",
                    hours === i ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary text-muted-foreground"
                  )}
                >
                  {i.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
            <div className="flex items-center text-muted-foreground">:</div>
            {/* Minutes */}
            <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
              {Array.from({ length: 12 }).map((_, i) => (
                <button
                  key={i * 5}
                  type="button"
                  onClick={() => handleTimeChange(hours, i * 5)}
                  className={cn(
                    "w-full py-1.5 text-[11px] rounded-md transition-all mb-0.5",
                    minutes === i * 5 ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary text-muted-foreground"
                  )}
                >
                  {(i * 5).toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
          <button 
             type="button" 
             onClick={() => setIsOpen(false)}
             className="w-full mt-2 py-2 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-colors"
          >
            Xong
          </button>
        </div>
      )}
    </div>
  );
}

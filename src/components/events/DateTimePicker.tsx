'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  
  const selectedDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(viewDate.getFullYear());
    newDate.setMonth(viewDate.getMonth());
    newDate.setDate(day);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const formattedDate = selectedDate.toLocaleDateString(locale === 'vi' ? 'vi-VN' : locale === 'jp' ? 'ja-JP' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const calendarDays = [];
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const daysCount = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysCount; i++) calendarDays.push(i);

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-semibold ml-1">{label || 'Ngày'}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full relative flex items-center justify-between px-4 bg-secondary/30 border border-border/50 rounded-xl h-12 text-sm text-foreground hover:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="font-medium">{formattedDate}</span>
        <Calendar size={16} className="text-muted-foreground opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-[280px] bg-background border border-border shadow-2xl rounded-2xl z-[200] p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button" 
              onClick={prevMonth} 
              disabled={viewDate.getFullYear() <= new Date().getFullYear() && viewDate.getMonth() <= new Date().getMonth()}
              className="p-1 hover:bg-secondary rounded-lg disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="font-bold text-xs">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
            <button type="button" onClick={nextMonth} className="p-1 hover:bg-secondary rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
              <div key={d} className="text-[10px] text-center font-bold text-muted-foreground py-1">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const isPast = day ? new Date(viewDate.getFullYear(), viewDate.getMonth(), day) < new Date(new Date().setHours(0,0,0,0)) : false;
              const isSelected = day && selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear();
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!day || isPast}
                  onClick={() => day && handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 text-[11px] rounded-lg flex items-center justify-center transition-colors",
                    !day ? "invisible" : isSelected ? "bg-primary text-primary-foreground font-bold" : isPast ? "opacity-20 cursor-default" : "hover:bg-secondary text-foreground"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

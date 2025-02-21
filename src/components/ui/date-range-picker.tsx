import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  selected?: DateRange;
  onSelect?: (dateRange: DateRange | undefined) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function DateRangePicker({
  selected,
  onSelect,
  className,
  label = "Date range picker",
  placeholder = "Pick a date range",
}: DateRangePickerProps) {
  const id = useId();
  const [date, setDate] = useState<DateRange | undefined>(selected);

  const handleSelect = (dateRange: DateRange | undefined) => {
    setDate(dateRange);
    if (onSelect) {
      onSelect(dateRange);
    }
  };

  return (
    <div>
      <div className="*:not-first:mt-2">
        <Label htmlFor={id}>{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              className={cn(
                "group bg-background hover:bg-background focus-visible:border-ring/40 outline-ring/8 dark:outline-ring/12 w-full justify-between px-3 font-normal outline-offset-0 focus-visible:outline-[3px]",
                !date && "text-muted-foreground",
                className
              )}
            >
              <span className={cn("truncate", !date && "text-muted-foreground")}>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  placeholder
                )}
              </span>
              <CalendarIcon
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar mode="range" selected={date} onSelect={handleSelect} />
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with{" "}
        <a
          className="hover:text-foreground underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  );
}
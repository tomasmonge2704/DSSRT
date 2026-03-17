"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDateRangePresetLabel,
  getDistinctWeekOptions,
  getWeekPreset,
  type DateRangePreset,
} from "@/lib/dashboard-filters";
import type { WeeklyMetrics } from "@/types/metrics";

interface DateRangePickerProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
  metrics: WeeklyMetrics[];
}

export function DateRangePicker({ value, onChange, metrics }: DateRangePickerProps) {
  const weekOptions = getDistinctWeekOptions(metrics).sort((a, b) =>
    b.weekStartDate.localeCompare(a.weekStartDate)
  );

  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangePreset)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Rango de fechas">
          {getDateRangePresetLabel(value, metrics)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">Todas las semanas</SelectItem>
          <SelectItem value="last4">Ultimas 4 semanas</SelectItem>
          <SelectItem value="last6">Ultimas 6 semanas</SelectItem>
          <SelectItem value="last8">Ultimas 8 semanas</SelectItem>
        </SelectGroup>
        {weekOptions.length > 0 ? (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Semanas importadas</SelectLabel>
              {weekOptions.map((week) => (
                <SelectItem
                  key={week.weekStartDate}
                  value={getWeekPreset(week.weekStartDate)}
                >
                  {week.weekLabel}
                </SelectItem>
              ))}
            </SelectGroup>
          </>
        ) : null}
      </SelectContent>
    </Select>
  );
}

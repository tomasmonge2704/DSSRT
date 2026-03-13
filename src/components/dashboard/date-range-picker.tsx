"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DATE_RANGE_LABELS,
  type DateRangePreset,
} from "@/lib/dashboard-filters";

interface DateRangePickerProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangePreset)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Rango de fechas">
          {DATE_RANGE_LABELS[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las semanas</SelectItem>
        <SelectItem value="last4">Ultimas 4 semanas</SelectItem>
        <SelectItem value="last6">Ultimas 6 semanas</SelectItem>
        <SelectItem value="last8">Ultimas 8 semanas</SelectItem>
      </SelectContent>
    </Select>
  );
}

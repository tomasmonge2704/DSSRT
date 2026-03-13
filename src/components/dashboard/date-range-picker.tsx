"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DateRangePreset = "all" | "last4" | "last6" | "last8";

interface DateRangePickerProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
}

const DATE_LABELS: Record<DateRangePreset, string> = {
  all: "Todas las semanas",
  last4: "Ultimas 4 semanas",
  last6: "Ultimas 6 semanas",
  last8: "Ultimas 8 semanas",
};

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangePreset)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Rango de fechas">
          {DATE_LABELS[value]}
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

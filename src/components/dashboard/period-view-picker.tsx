"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  METRIC_VIEW_MODE_LABELS,
  type MetricViewMode,
} from "@/lib/dashboard-filters";

interface PeriodViewPickerProps {
  value: MetricViewMode;
  onChange: (value: MetricViewMode) => void;
}

export function PeriodViewPicker({
  value,
  onChange,
}: PeriodViewPickerProps) {
  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as MetricViewMode)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Modo de calculo">
          {METRIC_VIEW_MODE_LABELS[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="weekly">Por semana</SelectItem>
        <SelectItem value="cumulative">Total acumulado</SelectItem>
      </SelectContent>
    </Select>
  );
}

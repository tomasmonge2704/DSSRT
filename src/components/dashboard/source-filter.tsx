"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MetricSource } from "@/types/metrics";

type SourceFilterValue = MetricSource | "all";

const SOURCE_LABELS: Record<SourceFilterValue, string> = {
  all: "Todas las fuentes",
  excel: "Excel",
  tiktok_api: "TikTok API",
};

interface SourceFilterProps {
  value: SourceFilterValue;
  onChange: (value: SourceFilterValue) => void;
}

export function SourceFilter({ value, onChange }: SourceFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SourceFilterValue)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{SOURCE_LABELS[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las fuentes</SelectItem>
        <SelectItem value="excel">Excel</SelectItem>
        <SelectItem value="tiktok_api">TikTok API</SelectItem>
      </SelectContent>
    </Select>
  );
}

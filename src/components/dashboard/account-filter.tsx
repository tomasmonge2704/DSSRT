"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountHandle } from "@/types/metrics";

type FilterValue = "all" | AccountHandle;

const ACCOUNT_LABELS: Record<FilterValue, string> = {
  all: "Ambas Cuentas",
  "@elosodebresh": "El Oso de Bresh",
  "@mundobresh": "Mundo Bresh",
};

interface AccountFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function AccountFilter({ value, onChange }: AccountFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as FilterValue)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar cuenta">
          {ACCOUNT_LABELS[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Ambas Cuentas</SelectItem>
        <SelectItem value="@elosodebresh">El Oso de Bresh</SelectItem>
        <SelectItem value="@mundobresh">Mundo Bresh</SelectItem>
      </SelectContent>
    </Select>
  );
}

export type { FilterValue };

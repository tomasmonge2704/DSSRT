"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountHandle, TikTokAccount } from "@/types/metrics";

type FilterValue = "all" | AccountHandle;

interface AccountFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  accounts: TikTokAccount[];
}

export function AccountFilter({ value, onChange, accounts }: AccountFilterProps) {
  const label =
    value === "all"
      ? "Todas las Cuentas"
      : accounts.find((a) => a.handle === value)?.displayName ?? value;

  return (
    <Select value={value} onValueChange={(v) => onChange(v as FilterValue)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar cuenta">{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las Cuentas</SelectItem>
        {accounts.map((account) => (
          <SelectItem key={account.handle} value={account.handle}>
            {account.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export type { FilterValue };

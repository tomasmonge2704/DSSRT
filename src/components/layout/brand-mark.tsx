"use client";

import Image from "next/image";
import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BRAND_CONFIGS,
  type DashboardBrand,
} from "@/lib/branding";

interface BrandMarkProps {
  brand: DashboardBrand;
  compact?: boolean;
}

export function BrandMark({ brand, compact = false }: BrandMarkProps) {
  const config = BRAND_CONFIGS[brand];

  if (config.logoSrc) {
    return (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-white/20 shadow-sm shadow-black/10",
            compact ? "size-9" : "size-10"
          )}
        >
          <Image
            src={config.logoSrc}
            alt={config.logoAlt}
            width={compact ? 36 : 40}
            height={compact ? 36 : 40}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold uppercase tracking-[0.28em]">
            {config.name}
          </p>
          {!compact ? (
            <p className="truncate text-xs text-muted-foreground">
              Branded analytics
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Music2 className={cn("text-primary", compact ? "h-5 w-5" : "h-6 w-6")} />
      <span className={cn("font-bold", !compact && "text-lg")}>{config.name}</span>
    </div>
  );
}

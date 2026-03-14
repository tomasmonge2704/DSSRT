"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import {
  BRAND_CONFIGS,
  DASHBOARD_NAV_ITEMS,
  getBrandHref,
  isBrandHrefActive,
  type DashboardBrand,
} from "@/lib/branding";

interface SidebarProps {
  brand?: DashboardBrand;
}

export function Sidebar({ brand = "default" }: SidebarProps) {
  const pathname = usePathname();
  const config = BRAND_CONFIGS[brand];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <BrandMark brand={brand} />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const href = getBrandHref(brand, item.href);
          const isActive = isBrandHrefActive(pathname, brand, item.href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">{config.footerLabel}</p>
      </div>
    </aside>
  );
}

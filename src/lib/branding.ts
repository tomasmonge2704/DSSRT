import {
  BarChart3,
  GitCompareArrows,
  Settings2,
  TrendingUp,
  Upload,
  type LucideIcon,
} from "lucide-react";

export type DashboardBrand = "default" | "bresh";

export interface BrandConfig {
  basePath: string;
  footerLabel: string;
  logoAlt: string;
  logoSrc?: string;
  name: string;
}

export const BRAND_CONFIGS: Record<DashboardBrand, BrandConfig> = {
  default: {
    basePath: "",
    footerLabel: "Bresh TikTok Analytics",
    logoAlt: "DSSRT",
    name: "DSSRT",
  },
  bresh: {
    basePath: "/bresh",
    footerLabel: "Bresh Branded Dashboard",
    logoAlt: "Logo Bresh",
    logoSrc: "/logo-bresh.jpg",
    name: "Bresh",
  },
};

export const DASHBOARD_NAV_ITEMS: Array<{
  href: string;
  icon: LucideIcon;
  label: string;
}> = [
  { href: "/", label: "Overview", icon: BarChart3 },
  { href: "/trends", label: "Tendencias", icon: TrendingUp },
  { href: "/compare", label: "Comparar", icon: GitCompareArrows },
  { href: "/import", label: "Importar", icon: Upload },
  { href: "/settings", label: "Conexiones", icon: Settings2 },
];

export function getBrandHref(brand: DashboardBrand, href: string): string {
  const { basePath } = BRAND_CONFIGS[brand];

  if (!basePath) {
    return href;
  }

  return href === "/" ? basePath : `${basePath}${href}`;
}

export function isBrandHrefActive(
  pathname: string,
  brand: DashboardBrand,
  href: string
): boolean {
  const targetHref = getBrandHref(brand, href);

  if (href === "/") {
    return pathname === targetHref;
  }

  return pathname === targetHref || pathname.startsWith(`${targetHref}/`);
}

import type { ChartConfig } from "@/components/ui/chart";
import type { TikTokAccount } from "@/types/metrics";

const DEFAULT_COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 67%, 58%)",
  "hsl(190, 90%, 45%)",
];

export function buildChartConfig(accounts: TikTokAccount[]): ChartConfig {
  const config: ChartConfig = {};
  for (let i = 0; i < accounts.length; i++) {
    const key = accounts[i].handle.replace("@", "");
    config[key] = {
      label: accounts[i].displayName,
      color: accounts[i].colorHsl ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    };
  }
  return config;
}

export function getAccountColor(
  accounts: TikTokAccount[],
  handle: string
): string {
  const idx = accounts.findIndex((a) => a.handle === handle);
  const account = accounts[idx];
  if (account?.colorHsl) return account.colorHsl;
  return DEFAULT_COLORS[(idx >= 0 ? idx : 0) % DEFAULT_COLORS.length];
}

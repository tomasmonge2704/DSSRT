import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import type { DashboardBrand } from "@/lib/branding";

interface DashboardShellProps {
  children: React.ReactNode;
  brand?: DashboardBrand;
}

export function DashboardShell({
  children,
  brand = "default",
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden bg-background text-foreground",
        brand === "bresh" && "brand-bresh"
      )}
    >
      <Sidebar brand={brand} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header brand={brand} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

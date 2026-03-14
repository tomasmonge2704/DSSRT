import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function BreshLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell brand="bresh">{children}</DashboardShell>;
}

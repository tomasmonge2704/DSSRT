import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VarianceBadge } from "./variance-badge";
import { formatNumber } from "@/lib/metrics-calculator";
import { Eye, Heart, MessageCircle, Share2, Users, UserSearch, Radio, Zap } from "lucide-react";
import type { MetricKey } from "@/types/metrics";

const METRIC_ICONS: Record<MetricKey, React.ElementType> = {
  views: Eye,
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
  followers: Users,
  profileVisits: UserSearch,
  reach: Radio,
  interactions: Zap,
};

interface KpiCardProps {
  metricKey: MetricKey;
  label: string;
  currentValue: number;
  variancePercent: number | null;
}

export function KpiCard({ metricKey, label, currentValue, variancePercent }: KpiCardProps) {
  const Icon = METRIC_ICONS[metricKey];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(currentValue)}</div>
        <div className="mt-1">
          <VarianceBadge value={variancePercent} />
        </div>
      </CardContent>
    </Card>
  );
}

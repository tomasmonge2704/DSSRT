import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VarianceBadgeProps {
  value: number | null;
}

export function VarianceBadge({ value }: VarianceBadgeProps) {
  if (value === null) {
    return (
      <Badge variant="secondary" className="gap-1 text-xs font-medium">
        <Minus className="h-3 w-3" />
        N/A
      </Badge>
    );
  }

  const isPositive = value > 0;
  const isZero = value === 0;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 text-xs font-medium",
        isPositive && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        !isPositive && !isZero && "bg-red-500/15 text-red-600 dark:text-red-400",
        isZero && "bg-muted text-muted-foreground"
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : isZero ? (
        <Minus className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </Badge>
  );
}

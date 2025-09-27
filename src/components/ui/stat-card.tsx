import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatCard({ title, value, description, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-gradient-card border rounded-lg p-6 shadow-card transition-all duration-200 hover:shadow-elevated",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium px-2 py-1 rounded-full",
            trend.direction === "up" ? "text-hr-success bg-hr-success/10" : "text-hr-warning bg-hr-warning/10"
          )}>
            <span>{trend.direction === "up" ? "↗" : "↘"}</span>
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
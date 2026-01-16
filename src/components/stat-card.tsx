import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  variant?: 'default' | 'stat' | 'dashboard';
  className?: string;
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  variant = 'default',
  className,
  icon,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'text-green-400'
      : trend === 'down'
      ? 'text-red-400'
      : 'text-gray-300';

  if (variant === 'dashboard' || variant === 'stat') {
    return (
      <div className={cn('dashboard-tile-simple p-6', className)}>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/90 uppercase tracking-wide">
              {label}
            </p>
            {icon && <div className="text-white/80">{icon}</div>}
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-white">{value}</span>
              {unit && (
                <span className="text-lg font-medium text-white/80">
                  {unit}
                </span>
              )}
            </div>
          </div>
          {trend && trendValue && (
            <div className={cn('flex items-center space-x-1 text-sm font-medium', trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && (
                <span className="text-sm text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
            {trend && trendValue && (
              <div className={cn('flex items-center space-x-1 text-sm', trendColor)}>
                <TrendIcon className="h-4 w-4" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
      ? 'text-[#27AE60]'
      : trend === 'down'
      ? 'text-[#EB5757]'
      : 'text-[#9CA3AF]';

  if (variant === 'dashboard' || variant === 'stat') {
    return (
      <div className={cn('dashboard-tile-simple p-6', className)}>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              {label}
            </p>
            {icon && <div className="text-[#9CA3AF]">{icon}</div>}
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-[#0F2A44]">{value}</span>
              {unit && (
                <span className="text-base font-medium text-[#6B7280]">
                  {unit}
                </span>
              )}
            </div>
          </div>
          {trend && trendValue && (
            <div className={cn('flex items-center space-x-1 text-sm font-semibold', trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-shadow bg-white', className)}>
      <CardContent className="p-5">
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-[#0F2A44]">{value}</span>
              {unit && (
                <span className="text-sm font-medium text-[#6B7280]">
                  {unit}
                </span>
              )}
            </div>
            {trend && trendValue && (
              <div className={cn('flex items-center space-x-1 text-sm font-semibold', trendColor)}>
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

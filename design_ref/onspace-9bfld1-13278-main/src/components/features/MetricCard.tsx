import type { MetricCard as MetricCardType } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: MetricCardType;
  icon?: React.ReactNode;
}

export default function MetricCard({ metric, icon }: MetricCardProps) {
  const trendIcon = {
    up: <TrendingUp className="size-3.5" />,
    down: <TrendingDown className="size-3.5" />,
    neutral: <Minus className="size-3.5" />,
  };

  const trendColor = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-500 bg-red-50',
    neutral: 'text-muted-foreground bg-muted',
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 card-elevated transition-all duration-200 hover:card-floating">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <p className="mt-2 font-[Outfit] text-2xl font-bold tracking-tight tabular-nums">{metric.value}</p>
        </div>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', trendColor[metric.trend])}>
          {trendIcon[metric.trend]}
          {Math.abs(metric.change)}%
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
}

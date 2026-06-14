"use client";

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label?: string };
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({ label, value, subtitle, trend, icon: Icon, className }: MetricCardProps) {
  const TrendIcon = trend
    ? trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus
    : null;

  const trendColor = trend
    ? trend.value > 0 ? 'text-[var(--color-success-default)]' : trend.value < 0 ? 'text-[var(--color-error-default)]' : 'text-[var(--color-text-tertiary)]'
    : '';

  return (
    <div
      className={cn(
        "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 transition-colors hover:border-[var(--color-border-default)]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="label-uppercase">{label}</p>
        {Icon && (
          <Icon className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        )}
      </div>

      <p className="text-3xl font-semibold font-mono-metric text-[var(--color-text-primary)] mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      <div className="flex items-center gap-2">
        {subtitle && (
          <span className="text-xs text-[var(--color-text-tertiary)]">{subtitle}</span>
        )}
        {trend && TrendIcon && (
          <span className={cn("flex items-center gap-0.5 text-xs font-medium", trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend.value)}%
            {trend.label && <span className="text-[var(--color-text-tertiary)] ml-0.5">{trend.label}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

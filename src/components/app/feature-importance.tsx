"use client";

import { cn } from '@/lib/utils';
import type { FeatureImportance } from '@/store/app-store';

interface FeatureImportanceChartProps {
  features: FeatureImportance[];
  maxFeatures?: number;
  className?: string;
}

function getRankBadge(rank: number): { label: string; className: string } | null {
  if (rank === 1) return { label: '1st', className: 'bg-[var(--importance-high)] text-white' };
  if (rank === 2) return { label: '2nd', className: 'bg-[var(--importance-medium)] text-[var(--color-text-inverse)]' };
  if (rank === 3) return { label: '3rd', className: 'bg-[var(--color-surface-4)] text-[var(--color-text-secondary)]' };
  return null;
}

function getBarColor(rank: number): string {
  if (rank <= 1) return 'var(--importance-high)';
  if (rank <= 2) return 'var(--importance-medium)';
  if (rank <= 3) return 'var(--chart-2)';
  return 'var(--importance-low)';
}

export function FeatureImportanceChart({ features, maxFeatures = 10, className }: FeatureImportanceChartProps) {
  const sorted = [...features]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, maxFeatures);

  const maxValue = sorted[0]?.importance || 1;

  return (
    <div className={cn("space-y-3", className)}>
      {sorted.map((feat, index) => {
        const rank = index + 1;
        const percentage = (feat.importance / maxValue) * 100;
        const badge = getRankBadge(rank);

        return (
          <div key={feat.feature} className="flex items-center gap-3">
            {/* Rank badge */}
            <div className="w-8 flex-shrink-0 text-center">
              {badge ? (
                <span className={cn("inline-block text-[10px] font-bold px-1.5 py-0.5 rounded", badge.className)}>
                  {badge.label}
                </span>
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)] font-mono-metric">
                  {rank}
                </span>
              )}
            </div>

            {/* Feature name */}
            <span className="w-32 text-sm text-[var(--color-text-secondary)] truncate flex-shrink-0">
              {feat.feature}
            </span>

            {/* Bar */}
            <div className="flex-1 h-5 bg-[var(--importance-bar-bg)] rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: getBarColor(rank),
                }}
              />
            </div>

            {/* Value */}
            <span className="w-16 text-right text-xs font-mono-metric text-[var(--color-text-secondary)]">
              {(feat.importance * 100).toFixed(1)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

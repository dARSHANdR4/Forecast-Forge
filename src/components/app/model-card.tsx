"use client";

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, type LucideIcon } from 'lucide-react';

interface ModelCardProps {
  modelType: string;
  taskType: 'regression' | 'classification';
  primaryMetric: { label: string; value: number };
  secondaryMetrics?: { label: string; value: number }[];
  trainingTimeMs: number;
  rank?: number | null;
  isBest?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const rankConfig: Record<number, { label: string; className: string }> = {
  1: { label: '#1 Best', className: 'bg-[var(--color-success-subtle)] text-[var(--color-success-default)] border-[var(--color-success-muted)]' },
  2: { label: '#2', className: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-default)] border-[var(--color-warning-muted)]' },
  3: { label: '#3', className: 'bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)] border-[var(--color-border-default)]' },
};

function formatModelName(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ModelCard({
  modelType, taskType, primaryMetric, secondaryMetrics, trainingTimeMs,
  rank, isBest, isSelected, onSelect, className
}: ModelCardProps) {
  const rankCfg = rank && rank <= 3 ? rankConfig[rank] : null;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "bg-[var(--color-surface-1)] border rounded-lg p-5 transition-all duration-200",
        isBest && "border-[var(--color-success-default)] bg-[var(--model-row-best)]",
        isSelected && !isBest && "border-[var(--color-accent-500)] shadow-accent",
        !isBest && !isSelected && "border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]",
        onSelect && "cursor-pointer",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-base font-semibold text-[var(--color-text-primary)]">
            {formatModelName(modelType)}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 capitalize">{taskType}</p>
        </div>
        <div className="flex items-center gap-2">
          {rankCfg && (
            <Badge variant="outline" className={cn("text-[10px] font-semibold border", rankCfg.className)}>
              {isBest && <Trophy className="w-3 h-3 mr-1" />}
              {rankCfg.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Primary Metric — large mono display */}
      <div className="mb-4">
        <p className="label-uppercase mb-1">{primaryMetric.label}</p>
        <p className="text-4xl font-semibold font-mono-metric text-[var(--color-text-primary)]">
          {primaryMetric.value.toFixed(4)}
        </p>
        {/* Accuracy bar */}
        <div className="mt-2 h-1.5 bg-[var(--color-surface-3)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(primaryMetric.value * 100, 0), 100)}%`,
              backgroundColor: isBest ? 'var(--color-success-default)' : 'var(--color-accent-500)',
            }}
          />
        </div>
      </div>

      {/* Secondary Metrics */}
      {secondaryMetrics && secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {secondaryMetrics.map(m => (
            <div key={m.label}>
              <p className="text-xs text-[var(--color-text-tertiary)]">{m.label}</p>
              <p className="text-sm font-mono-metric text-[var(--color-text-secondary)]">
                {m.value.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
        <Clock className="w-3 h-3" />
        {formatDuration(trainingTimeMs)}
      </div>
    </div>
  );
}

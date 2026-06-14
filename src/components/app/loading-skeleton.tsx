"use client";

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'chart' | 'metric' | 'table-row';
  count?: number;
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("h-4 rounded skeleton-shimmer", className)} />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 space-y-3">
      <SkeletonLine className="w-24 h-3" />
      <SkeletonLine className="w-32 h-8" />
      <SkeletonLine className="w-full h-3" />
    </div>
  );
}

function SkeletonMetric() {
  return (
    <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 space-y-3">
      <SkeletonLine className="w-20 h-3" />
      <SkeletonLine className="w-24 h-9" />
      <SkeletonLine className="w-16 h-3" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 space-y-4">
      <div className="flex justify-between">
        <SkeletonLine className="w-32 h-4" />
        <SkeletonLine className="w-20 h-4" />
      </div>
      <div className="h-48 rounded skeleton-shimmer" />
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <div className="flex gap-4 py-3 border-b border-[var(--color-border-subtle)]">
      <SkeletonLine className="w-32 h-4" />
      <SkeletonLine className="w-24 h-4" />
      <SkeletonLine className="w-20 h-4" />
      <SkeletonLine className="w-16 h-4" />
    </div>
  );
}

export function LoadingSkeleton({ className, variant = 'text', count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((i) => {
        switch (variant) {
          case 'card': return <SkeletonCard key={i} />;
          case 'metric': return <SkeletonMetric key={i} />;
          case 'chart': return <SkeletonChart key={i} />;
          case 'table-row': return <SkeletonTableRow key={i} />;
          default: return <SkeletonLine key={i} className="w-full" />;
        }
      })}
    </div>
  );
}

"use client";

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, subtitle, actions, children, className }: ChartContainerProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Chart content */}
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  );
}

"use client";

import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';
import { ReactNode } from 'react';

interface AiInsightCardProps {
  title?: string;
  children: ReactNode;
  source?: string;
  className?: string;
}

export function AiInsightCard({ title = "AI Insight", children, source, className }: AiInsightCardProps) {
  return (
    <div
      className={cn(
        "ai-border bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[rgba(232,64,64,0.12)] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-[var(--color-accent-500)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">{title}</p>
          <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-2">
            {children}
          </div>
          {source && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
              Based on: {source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

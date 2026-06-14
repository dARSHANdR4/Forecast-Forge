"use client";

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PredictionCardProps {
  label: string;
  value: number | string;
  confidenceLower?: number;
  confidenceUpper?: number;
  inputSummary?: string;
  className?: string;
}

export function PredictionCard({ label, value, confidenceLower, confidenceUpper, inputSummary, className }: PredictionCardProps) {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  const hasConfidence = confidenceLower !== undefined && confidenceUpper !== undefined;

  return (
    <div
      className={cn(
        "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-xl p-8 text-center animate-scale-in",
        className
      )}
    >
      <p className="label-uppercase mb-4">{label}</p>

      {/* Large predicted value */}
      <p className="text-5xl font-bold font-mono-metric text-[var(--color-text-primary)] mb-2">
        {typeof value === 'number' ? value.toFixed(2) : value}
      </p>

      {/* Confidence range */}
      {hasConfidence && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
            <TrendingDown className="w-3 h-3" />
            <span className="font-mono-metric">{confidenceLower!.toFixed(2)}</span>
          </div>
          <div className="w-16 h-1 bg-[var(--color-surface-3)] rounded-full relative">
            <div
              className="absolute h-full bg-[var(--color-accent-500)] rounded-full"
              style={{
                left: '20%',
                right: '20%',
              }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
            <TrendingUp className="w-3 h-3" />
            <span className="font-mono-metric">{confidenceUpper!.toFixed(2)}</span>
          </div>
        </div>
      )}

      {hasConfidence && (
        <p className="text-xs text-[var(--color-text-tertiary)]">95% Confidence Interval</p>
      )}

      {inputSummary && (
        <p className="text-xs text-[var(--color-text-tertiary)] mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          {inputSummary}
        </p>
      )}
    </div>
  );
}

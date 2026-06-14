"use client";

import { cn } from '@/lib/utils';
import { type LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-8 text-center", className)}>
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[var(--color-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-tertiary)] max-w-sm">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

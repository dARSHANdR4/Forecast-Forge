"use client";

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorState({ error, reset }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[var(--color-surface-1)] rounded-lg border border-[var(--color-border-subtle)] animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[rgba(232,64,64,0.1)] flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-[var(--color-error-default)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-md mb-6">
        {error.message || "An unexpected error occurred while processing your request. Please try again or restart the application."}
      </p>
      <Button
        onClick={() => reset()}
        className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </Button>
    </div>
  );
}

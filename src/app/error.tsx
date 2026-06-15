"use client";

import { useEffect } from 'react';
import { ErrorState } from '@/components/app/error-state';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="max-w-xl w-full">
        <ErrorState error={error} reset={reset} />
      </div>
    </div>
  );
}

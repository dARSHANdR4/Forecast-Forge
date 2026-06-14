"use client";

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useUI } from '@/store/app-store';
import { cn } from '@/lib/utils';

const pathNames: Record<string, string> = {
  '/': 'Dashboard',
  '/upload': 'Upload Data',
  '/explore': 'Explore Data',
  '/clean': 'Clean Data',
  '/train': 'Train Models',
  '/compare': 'Compare Models',
  '/predict': 'Predict',
  '/results': 'Results',
};

export function TopNav() {
  const pathname = usePathname();
  const { ui } = useUI();

  const segments = pathname === '/'
    ? ['Dashboard']
    : ['Dashboard', pathNames[pathname] || pathname.slice(1)];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-topbar bg-[var(--color-surface-0)] border-b border-[var(--color-border-subtle)] flex items-center px-6 z-30 transition-all duration-300",
        ui.sidebarCollapsed ? "left-sidebar-collapsed" : "left-sidebar"
      )}
      style={{
        left: ui.sidebarCollapsed ? 'var(--layout-sidebar-collapsed)' : 'var(--layout-sidebar-width)',
      }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {segments.map((segment, i) => (
          <span key={segment} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            )}
            <span
              className={cn(
                i === segments.length - 1
                  ? "text-[var(--color-text-primary)] font-medium"
                  : "text-[var(--color-text-tertiary)]"
              )}
            >
              {segment}
            </span>
          </span>
        ))}
      </nav>
    </header>
  );
}

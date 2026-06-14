"use client";

import { AppProvider, useUI } from '@/store/app-store';
import { AppSidebar } from '@/components/app/app-sidebar';
import { TopNav } from '@/components/app/top-nav';
import { cn } from '@/lib/utils';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { ui } = useUI();

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)]">
      <AppSidebar />
      <TopNav />
      <main
        className={cn(
          "pt-topbar min-h-screen transition-all duration-300"
        )}
        style={{
          marginLeft: ui.sidebarCollapsed
            ? 'var(--layout-sidebar-collapsed)'
            : 'var(--layout-sidebar-width)',
        }}
      >
        <div className="max-w-content mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppProvider>
  );
}

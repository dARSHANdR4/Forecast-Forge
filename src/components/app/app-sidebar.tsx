"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Upload,
  Search,
  Sparkles,
  Brain,
  BarChart3,
  TrendingUp,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/store/app-store';

const navItems = [
  {
    label: 'WORKFLOW',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard, step: 0 },
      { name: 'Upload', href: '/upload', icon: Upload, step: 1 },
      { name: 'Explore', href: '/explore', icon: Search, step: 2 },
      { name: 'Clean', href: '/clean', icon: Sparkles, step: 3 },
      { name: 'Train', href: '/train', icon: Brain, step: 4 },
      { name: 'Compare', href: '/compare', icon: BarChart3, step: 5 },
      { name: 'Predict', href: '/predict', icon: TrendingUp, step: 6 },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { ui, dispatch } = useUI();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] flex flex-col transition-all duration-300 z-40",
        ui.sidebarCollapsed ? "w-sidebar-collapsed" : "w-sidebar"
      )}
    >
      {/* Logo */}
      <div className="h-topbar flex items-center gap-3 px-5 border-b border-[var(--color-border-subtle)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-500)] flex items-center justify-center flex-shrink-0">
          <Flame className="w-4 h-4 text-white" />
        </div>
        {!ui.sidebarCollapsed && (
          <span className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight animate-fade-in">
            Forecast Forge
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.label} className="mb-6">
            {!ui.sidebarCollapsed && (
              <p className="label-uppercase px-5 mb-2">{section.label}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors duration-150 relative group",
                        isActive
                          ? "text-[var(--color-text-primary)] bg-[rgba(232,64,64,0.08)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-white-05)]"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[var(--color-accent-500)] rounded-r-full" />
                      )}
                      <item.icon className={cn(
                        "w-[18px] h-[18px] flex-shrink-0",
                        isActive ? "text-[var(--color-accent-500)]" : ""
                      )} />
                      {!ui.sidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="h-12 flex items-center justify-center border-t border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label={ui.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {ui.sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}

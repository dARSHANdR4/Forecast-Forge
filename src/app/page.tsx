"use client";

import { useRouter } from 'next/navigation';
import { Upload, Brain, BarChart3, TrendingUp, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { MetricCard } from '@/components/app/metric-card';
import { EmptyState } from '@/components/app/empty-state';
import { DatasetCard } from '@/components/app/dataset-card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';

const workflowSteps = [
  {
    icon: Upload,
    title: 'Upload Data',
    description: 'Drop your CSV file and let the engine analyze it.',
    href: '/upload',
    color: 'var(--color-accent-500)',
  },
  {
    icon: Sparkles,
    title: 'Explore & Clean',
    description: 'Visualize distributions, handle missing values, fix outliers.',
    href: '/explore',
    color: 'var(--chart-3)',
  },
  {
    icon: Brain,
    title: 'Train Models',
    description: 'Run 5 real ML algorithms and compare performance.',
    href: '/train',
    color: 'var(--chart-2)',
  },
  {
    icon: TrendingUp,
    title: 'Predict',
    description: 'Use the best model to generate predictions with confidence intervals.',
    href: '/predict',
    color: 'var(--chart-4)',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useAppState();
  const hasData = !!state.dataset.meta;
  const hasModels = state.training.models.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-surface-1)] to-[var(--color-surface-2)] p-8 md:p-10">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-500)] flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              Forecast Forge
            </h1>
          </div>
          <p className="text-base text-[var(--color-text-secondary)] max-w-lg leading-relaxed">
            Go from raw CSV to real predictions — no code, no Python, no external APIs.
            Everything runs in your browser.
          </p>
          {!hasData && (
            <Button
              onClick={() => router.push('/upload')}
              className="mt-6 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Your First Dataset
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-accent-500)] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      {/* Quick stats — only show if data loaded */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Dataset"
            value={state.dataset.meta!.filename}
            subtitle={`${state.dataset.meta!.rowCount.toLocaleString()} rows × ${state.dataset.meta!.columnCount} columns`}
          />
          <MetricCard
            label="Columns"
            value={state.dataset.columns.length}
            subtitle={`${state.dataset.columns.filter(c => c.type === 'numeric').length} numeric, ${state.dataset.columns.filter(c => c.type === 'categorical').length} categorical`}
          />
          <MetricCard
            label="Models Trained"
            value={state.training.models.length}
            subtitle={hasModels ? `Best: ${state.training.models.find(m => m.rank === 1)?.modelType || '—'}` : 'Not yet trained'}
          />
          <MetricCard
            label="Predictions"
            value={state.predictions.singlePredictions.length}
            subtitle="Total predictions made"
          />
        </div>
      )}

      {/* Dataset card if loaded */}
      {hasData && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Current Dataset</h2>
          <DatasetCard
            filename={state.dataset.meta!.filename}
            rowCount={state.dataset.meta!.rowCount}
            columnCount={state.dataset.meta!.columnCount}
            uploadedAt={state.dataset.meta!.uploadedAt}
            status={state.dataset.meta!.status}
            fileSizeBytes={state.dataset.meta!.fileSizeBytes}
            onClick={() => router.push('/explore')}
          />
        </div>
      )}

      {/* Workflow cards */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, i) => (
            <button
              key={step.title}
              onClick={() => router.push(step.href)}
              className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 text-left transition-all duration-200 hover:border-[var(--color-border-default)] hover:shadow-md group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                {step.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-accent-500)] opacity-0 group-hover:opacity-100 transition-opacity">
                Start <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

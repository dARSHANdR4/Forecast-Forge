"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { ChartContainer } from '@/components/app/chart-container';
import { AiInsightCard } from '@/components/app/ai-insight-card';
import { EmptyState } from '@/components/app/empty-state';
import { MetricCard } from '@/components/app/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/store/app-store';
import { detectIssues, handleMissingValues, handleOutliers } from '@/lib/data-cleaning';
import { analyzeDataset } from '@/lib/data-analysis';

type CleaningAction = {
  id: string;
  column: string;
  type: 'missing' | 'outlier';
  strategy: string;
  applied: boolean;
  affectedRows: number;
};

export default function CleanPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [actions, setActions] = useState<CleaningAction[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);

  const { columns, headers, parsedData, meta } = state.dataset;
  const hasData = !!meta;

  // Detect issues
  const issues = hasData ? detectIssues(parsedData, headers) : null;

  // Auto-suggest cleaning actions
  const suggestActions = useCallback(() => {
    if (!issues) return;
    const suggested: CleaningAction[] = [];

    for (const mc of issues.missingColumns) {
      const col = columns.find(c => c.name === mc.column);
      const strategy = col?.type === 'numeric'
        ? (mc.percent > 30 ? 'drop' : 'fill_median')
        : 'fill_mode';

      suggested.push({
        id: crypto.randomUUID(),
        column: mc.column,
        type: 'missing',
        strategy,
        applied: false,
        affectedRows: mc.count,
      });
    }

    for (const oc of issues.outlierColumns) {
      suggested.push({
        id: crypto.randomUUID(),
        column: oc.column,
        type: 'outlier',
        strategy: 'clip',
        applied: false,
        affectedRows: oc.count,
      });
    }

    setActions(suggested);
  }, [issues, columns]);

  // Apply all cleaning actions
  const applyAll = useCallback(() => {
    if (!hasData) return;
    setIsCleaning(true);

    let currentData = [...parsedData.map(r => ({ ...r }))];

    for (const action of actions) {
      if (action.applied) continue;

      if (action.type === 'missing') {
        currentData = handleMissingValues(
          currentData,
          action.column,
          action.strategy as any
        );
      } else if (action.type === 'outlier') {
        currentData = handleOutliers(
          currentData,
          action.column,
          action.strategy as any
        );
      }
    }

    // Rebuild CSV from cleaned data
    const csvLines = [headers.join(',')];
    for (const row of currentData) {
      csvLines.push(headers.map(h => row[h] || '').join(','));
    }
    const cleanedCsv = csvLines.join('\n');

    // Re-analyze
    const newColumns = analyzeDataset(headers, currentData);

    // Update store
    dispatch({ type: 'SET_CLEANED_CSV', payload: cleanedCsv });
    dispatch({ type: 'SET_COLUMNS', payload: newColumns });
    dispatch({
      type: 'SET_DATASET',
      payload: {
        parsedData: currentData,
        cleanedCsv,
        columns: newColumns,
        meta: { ...meta!, status: 'cleaned', rowCount: currentData.length },
      },
    });

    // Mark all actions as applied
    setActions(prev => prev.map(a => ({ ...a, applied: true })));
    setIsCleaning(false);
  }, [actions, parsedData, headers, meta, dispatch, hasData]);

  if (!hasData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={3} />
        <EmptyState
          icon={Sparkles}
          title="No Data to Clean"
          description="Upload and explore a dataset first."
          actionLabel="Go to Upload"
          onAction={() => router.push('/upload')}
        />
      </div>
    );
  }

  const allApplied = actions.length > 0 && actions.every(a => a.applied);

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={3} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Clean Data
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Handle missing values, outliers, and data quality issues.
          </p>
        </div>
        {actions.length === 0 && issues && issues.totalIssues > 0 && (
          <Button onClick={suggestActions} variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Auto-Suggest Fixes
          </Button>
        )}
      </div>

      {/* Issue summary */}
      {issues && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Missing Values"
            value={issues.missingColumns.length}
            subtitle={issues.missingColumns.length > 0 ? 'columns affected' : 'All clean'}
            icon={issues.missingColumns.length > 0 ? AlertTriangle : CheckCircle2}
          />
          <MetricCard
            label="Outliers"
            value={issues.outlierColumns.length}
            subtitle={issues.outlierColumns.length > 0 ? 'columns with outliers' : 'None detected'}
            icon={issues.outlierColumns.length > 0 ? AlertTriangle : CheckCircle2}
          />
          <MetricCard
            label="Categorical"
            value={issues.categoricalColumns.length}
            subtitle="columns detected"
          />
        </div>
      )}

      {/* Issues detail */}
      {issues && issues.totalIssues > 0 && actions.length === 0 && (
        <AiInsightCard title="Data Quality Report" source="Automated analysis">
          <ul className="space-y-1 list-disc list-inside">
            {issues.missingColumns.map(mc => (
              <li key={mc.column}>
                <strong>{mc.column}</strong>: {mc.count} missing values ({mc.percent.toFixed(1)}%)
              </li>
            ))}
            {issues.outlierColumns.map(oc => (
              <li key={oc.column}>
                <strong>{oc.column}</strong>: {oc.count} potential outliers (Z-score &gt; 3)
              </li>
            ))}
          </ul>
        </AiInsightCard>
      )}

      {/* No issues */}
      {issues && issues.totalIssues === 0 && (
        <div className="flex items-center gap-4 p-5 bg-[var(--color-success-subtle)] border border-[var(--color-success-muted)] rounded-lg">
          <CheckCircle2 className="w-6 h-6 text-[var(--color-success-default)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Data looks clean!</p>
            <p className="text-xs text-[var(--color-text-secondary)]">No missing values or outliers detected. You can proceed to training.</p>
          </div>
        </div>
      )}

      {/* Cleaning actions */}
      {actions.length > 0 && (
        <ChartContainer title="Cleaning Actions" subtitle={`${actions.filter(a => a.applied).length}/${actions.length} applied`}>
          <div className="space-y-3">
            {actions.map(action => (
              <div
                key={action.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  action.applied
                    ? 'bg-[var(--color-success-subtle)] border-[var(--color-success-muted)]'
                    : 'bg-[var(--color-surface-2)] border-[var(--color-border-subtle)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {action.applied ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success-default)]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[var(--color-warning-default)]" />
                  )}
                  <div>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      <strong>{action.column}</strong> — {action.type === 'missing' ? 'Missing values' : 'Outliers'}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      Strategy: {action.strategy.replace('_', ' ')} • {action.affectedRows} rows affected
                    </p>
                  </div>
                </div>
                <Badge variant={action.applied ? 'default' : 'outline'} className="text-[10px]">
                  {action.applied ? 'Applied' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>

          {!allApplied && (
            <Button
              onClick={applyAll}
              disabled={isCleaning}
              className="mt-4 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2 w-full"
            >
              {isCleaning ? 'Cleaning...' : 'Apply All Fixes'}
            </Button>
          )}
        </ChartContainer>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/train')}
          className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
        >
          Train Models
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

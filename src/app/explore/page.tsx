"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, AlertTriangle } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { MetricCard } from '@/components/app/metric-card';
import { ChartContainer } from '@/components/app/chart-container';
import { AiInsightCard } from '@/components/app/ai-insight-card';
import { EmptyState } from '@/components/app/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/store/app-store';
import { computeCorrelationMatrix, computeHistogram } from '@/lib/data-analysis';

export default function ExplorePage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [correlationData, setCorrelationData] = useState<{ columns: string[]; matrix: number[][] } | null>(null);

  const { columns, headers, parsedData, meta } = state.dataset;
  const hasData = !!meta;

  // Compute correlation matrix on mount
  useEffect(() => {
    if (headers.length > 0 && parsedData.length > 0) {
      const corrData = computeCorrelationMatrix(headers, parsedData);
      setCorrelationData(corrData);
      dispatch({ type: 'SET_CORRELATION_MATRIX', payload: corrData.matrix });
      
      // Auto-select first column
      if (!selectedCol && columns.length > 0) {
        setSelectedCol(columns[0].name);
      }
    }
  }, [headers, parsedData]);

  if (!hasData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={2} />
        <EmptyState
          icon={Search}
          title="No Data to Explore"
          description="Upload a dataset first to see column statistics, distributions, and correlations."
          actionLabel="Go to Upload"
          onAction={() => router.push('/upload')}
        />
      </div>
    );
  }

  const selectedColumn = columns.find(c => c.name === selectedCol);
  const numericColumns = columns.filter(c => c.type === 'numeric');
  const categoricalColumns = columns.filter(c => c.type === 'categorical');
  const missingColumns = columns.filter(c => c.missingCount > 0);

  // Compute histogram for selected column
  let histogram: { binStart: number; binEnd: number; count: number }[] = [];
  if (selectedColumn?.type === 'numeric') {
    const values = parsedData.map(r => parseFloat(r[selectedColumn.name])).filter(v => !isNaN(v));
    histogram = computeHistogram(values, 20).counts;
  }

  // Value counts for categorical
  let valueCounts: { value: string; count: number }[] = [];
  if (selectedColumn?.type === 'categorical') {
    const counts = new Map<string, number>();
    for (const row of parsedData) {
      const v = row[selectedColumn.name] || 'N/A';
      counts.set(v, (counts.get(v) || 0) + 1);
    }
    valueCounts = [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  const maxHistCount = Math.max(...histogram.map(h => h.count), 1);
  const maxCatCount = Math.max(...valueCounts.map(v => v.count), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={2} />

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Explore Data
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Understand your dataset — distributions, correlations, and data quality.
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Rows" value={meta!.rowCount} />
        <MetricCard label="Columns" value={meta!.columnCount} />
        <MetricCard
          label="Numeric"
          value={numericColumns.length}
          subtitle={`${categoricalColumns.length} categorical`}
        />
        <MetricCard
          label="Missing Values"
          value={missingColumns.length}
          subtitle={missingColumns.length > 0 ? 'columns affected' : 'None detected'}
        />
      </div>

      {/* Column selector + details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column list */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Columns</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {columns.map(col => (
                <button
                  key={col.name}
                  onClick={() => setSelectedCol(col.name)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors border-b border-[var(--color-border-subtle)] last:border-b-0 ${
                    selectedCol === col.name
                      ? 'bg-[rgba(232,64,64,0.08)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-white-05)]'
                  }`}
                >
                  <span className="truncate">{col.name}</span>
                  <div className="flex items-center gap-2">
                    {col.missingCount > 0 && (
                      <AlertTriangle className="w-3 h-3 text-[var(--color-warning-default)]" />
                    )}
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {col.type}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedColumn && (
            <>
              {/* Stats */}
              <ChartContainer title={`${selectedColumn.name} — Statistics`} subtitle={selectedColumn.type}>
                {selectedColumn.type === 'numeric' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Mean', value: selectedColumn.mean?.toFixed(2) },
                      { label: 'Median', value: selectedColumn.median?.toFixed(2) },
                      { label: 'Std Dev', value: selectedColumn.stdDev?.toFixed(2) },
                      { label: 'Min', value: selectedColumn.min?.toFixed(2) },
                      { label: 'Max', value: selectedColumn.max?.toFixed(2) },
                      { label: 'Q25', value: selectedColumn.q25?.toFixed(2) },
                      { label: 'Q75', value: selectedColumn.q75?.toFixed(2) },
                      { label: 'Missing', value: `${selectedColumn.missingCount} (${selectedColumn.missingPercent.toFixed(1)}%)` },
                    ].map(stat => (
                      <div key={stat.label}>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{stat.label}</p>
                        <p className="text-sm font-mono-metric text-[var(--color-text-primary)]">
                          {stat.value ?? '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Unique Values</p>
                      <p className="text-sm font-mono-metric text-[var(--color-text-primary)]">{selectedColumn.uniqueCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Missing</p>
                      <p className="text-sm font-mono-metric text-[var(--color-text-primary)]">
                        {selectedColumn.missingCount} ({selectedColumn.missingPercent.toFixed(1)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)]">Type</p>
                      <p className="text-sm text-[var(--color-text-primary)] capitalize">{selectedColumn.type}</p>
                    </div>
                  </div>
                )}
              </ChartContainer>

              {/* Distribution */}
              {selectedColumn.type === 'numeric' && histogram.length > 0 && (
                <ChartContainer title="Distribution" subtitle="Histogram">
                  <div className="flex items-end gap-[2px] h-40">
                    {histogram.map((bin, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[var(--color-accent-500)] rounded-t-sm transition-all hover:opacity-80 relative group"
                        style={{ height: `${(bin.count / maxHistCount) * 100}%`, minHeight: bin.count > 0 ? '2px' : '0' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] rounded px-2 py-1 text-[10px] font-mono-metric text-[var(--color-text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {bin.count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-mono-metric text-[var(--color-text-tertiary)]">
                    <span>{histogram[0]?.binStart.toFixed(1)}</span>
                    <span>{histogram[histogram.length - 1]?.binEnd.toFixed(1)}</span>
                  </div>
                </ChartContainer>
              )}

              {/* Categorical value counts */}
              {selectedColumn.type === 'categorical' && valueCounts.length > 0 && (
                <ChartContainer title="Value Counts" subtitle={`Top ${valueCounts.length} values`}>
                  <div className="space-y-2">
                    {valueCounts.map(vc => (
                      <div key={vc.value} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-[var(--color-text-secondary)] truncate">{vc.value}</span>
                        <div className="flex-1 h-5 bg-[var(--color-surface-3)] rounded overflow-hidden">
                          <div
                            className="h-full bg-[var(--color-accent-500)] rounded"
                            style={{ width: `${(vc.count / maxCatCount) * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-xs font-mono-metric text-[var(--color-text-tertiary)]">
                          {vc.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartContainer>
              )}
            </>
          )}
        </div>
      </div>

      {/* Correlation matrix */}
      {correlationData && correlationData.columns.length > 1 && (
        <ChartContainer
          title="Correlation Matrix"
          subtitle={`${correlationData.columns.length} numeric columns`}
        >
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="p-2" />
                  {correlationData.columns.map(col => (
                    <th key={col} className="p-2 text-[var(--color-text-tertiary)] font-normal max-w-[60px] truncate" title={col}>
                      {col.length > 8 ? col.slice(0, 8) + '…' : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlationData.columns.map((rowCol, i) => (
                  <tr key={rowCol}>
                    <td className="p-2 text-[var(--color-text-tertiary)] font-normal truncate max-w-[80px]" title={rowCol}>
                      {rowCol.length > 10 ? rowCol.slice(0, 10) + '…' : rowCol}
                    </td>
                    {correlationData.matrix[i].map((val, j) => {
                      const isDiag = i === j;
                      const absVal = Math.abs(val);
                      let bgColor: string;
                      if (isDiag) bgColor = 'var(--heatmap-diagonal)';
                      else if (val > 0.5) bgColor = 'var(--heatmap-strong-positive)';
                      else if (val > 0) bgColor = 'var(--heatmap-mild-positive)';
                      else if (val < -0.5) bgColor = 'var(--heatmap-strong-negative)';
                      else if (val < 0) bgColor = 'var(--heatmap-mild-negative)';
                      else bgColor = 'var(--heatmap-neutral)';

                      return (
                        <td
                          key={j}
                          className="p-2 text-center font-mono-metric text-[10px] rounded-sm"
                          style={{
                            backgroundColor: bgColor,
                            color: absVal > 0.5 ? 'white' : 'var(--color-text-secondary)',
                          }}
                        >
                          {isDiag ? '1.00' : val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>
      )}

      {/* Data quality insight */}
      {missingColumns.length > 0 && (
        <AiInsightCard title="Data Quality Issues" source="Missing value analysis">
          <p>
            {missingColumns.length} column{missingColumns.length > 1 ? 's have' : ' has'} missing values:{' '}
            {missingColumns.map(c => `${c.name} (${c.missingPercent.toFixed(1)}%)`).join(', ')}.
            Clean your data in the next step to handle these.
          </p>
        </AiInsightCard>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/clean')}
          className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
        >
          Clean Data
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

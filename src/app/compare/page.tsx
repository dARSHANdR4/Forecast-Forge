"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { ChartContainer } from '@/components/app/chart-container';
import { FeatureImportanceChart } from '@/components/app/feature-importance';
import { EmptyState } from '@/components/app/empty-state';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';
import { getModelDisplayName, type ModelType } from '@/lib/ml-service';
import type { RegressionMetrics, ClassificationMetrics } from '@/store/app-store';

export default function ComparePage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();

  const models = state.training.models;
  const hasModels = models.length > 0;
  const isRegression = hasModels && models[0].taskType === 'regression';
  const selectedModel = models.find(m => m.isSelected) || models[0];

  if (!hasModels) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={5} />
        <EmptyState
          icon={BarChart3}
          title="No Models to Compare"
          description="Train models first to see a detailed comparison."
          actionLabel="Go to Train"
          onAction={() => router.push('/train')}
        />
      </div>
    );
  }

  const sorted = [...models].sort((a, b) => (a.rank || 99) - (b.rank || 99));

  // Metrics for the comparison table
  const metricLabels = isRegression
    ? ['R²', 'RMSE', 'MAE', 'MSE']
    : ['Accuracy', 'Precision', 'Recall', 'F1 Score'];

  const getMetricValue = (model: typeof models[0], metricIndex: number): number => {
    if (isRegression) {
      const m = model.metrics as RegressionMetrics;
      return [m.r2, m.rmse, m.mae, m.mse][metricIndex];
    }
    const m = model.metrics as ClassificationMetrics;
    return [m.accuracy, m.precision, m.recall, m.f1Score][metricIndex];
  };

  // Determine best value per metric for highlighting
  const bestPerMetric = metricLabels.map((_, idx) => {
    const values = sorted.map(m => getMetricValue(m, idx));
    if (isRegression && idx > 0) {
      // For RMSE, MAE, MSE: lower is better
      return Math.min(...values);
    }
    return Math.max(...values);
  });

  // Actual vs Predicted data for selected model
  const actualVsPredicted = selectedModel
    ? selectedModel.actuals.map((actual, i) => ({
        actual,
        predicted: selectedModel.predictions[i],
      }))
    : [];

  // Compute residuals
  const residuals = actualVsPredicted.map(p => p.actual - p.predicted);
  const maxResidual = Math.max(...residuals.map(r => Math.abs(r)), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={5} />

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Compare Models
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Side-by-side comparison of all trained models.
        </p>
      </div>

      {/* Comparison table */}
      <ChartContainer title="Performance Comparison" subtitle={`${sorted.length} models`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th className="text-left px-3 py-3 text-xs font-semibold text-[var(--color-text-tertiary)]">Rank</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-[var(--color-text-tertiary)]">Model</th>
                {metricLabels.map(label => (
                  <th key={label} className="text-right px-3 py-3 text-xs font-semibold text-[var(--color-text-tertiary)]">{label}</th>
                ))}
                <th className="text-right px-3 py-3 text-xs font-semibold text-[var(--color-text-tertiary)]">Time</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(model => (
                <tr
                  key={model.id}
                  onClick={() => dispatch({ type: 'SELECT_MODEL', payload: model.id })}
                  className={`border-b border-[var(--color-border-subtle)] cursor-pointer transition-colors ${
                    model.isSelected
                      ? 'bg-[rgba(232,64,64,0.06)]'
                      : model.rank === 1
                      ? 'bg-[var(--model-row-best)]'
                      : 'hover:bg-[var(--color-white-05)]'
                  }`}
                >
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      model.rank === 1 ? 'bg-[var(--color-success-muted)] text-[var(--color-success-default)]'
                      : model.rank === 2 ? 'bg-[var(--color-warning-muted)] text-[var(--color-warning-default)]'
                      : 'bg-[var(--color-surface-3)] text-[var(--color-text-tertiary)]'
                    }`}>
                      {model.rank}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-[var(--color-text-primary)]">
                    {getModelDisplayName(model.modelType as ModelType)}
                  </td>
                  {metricLabels.map((_, idx) => {
                    const value = getMetricValue(model, idx);
                    const isBest = Math.abs(value - bestPerMetric[idx]) < 0.0001;
                    return (
                      <td key={idx} className="px-3 py-3 text-right">
                        <span className={`font-mono-metric ${
                          isBest ? 'text-[var(--color-success-default)] font-semibold' : 'text-[var(--color-text-secondary)]'
                        }`}>
                          {value.toFixed(4)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-right text-xs text-[var(--color-text-tertiary)] font-mono-metric">
                    {model.trainingTimeMs < 1000 ? `${model.trainingTimeMs}ms` : `${(model.trainingTimeMs / 1000).toFixed(1)}s`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>

      {/* Actual vs Predicted scatter */}
      {selectedModel && isRegression && actualVsPredicted.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Actual vs Predicted"
            subtitle={getModelDisplayName(selectedModel.modelType as ModelType)}
          >
            <div className="relative h-64 bg-[var(--color-surface-2)] rounded overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0">
                {[0.25, 0.5, 0.75].map(p => (
                  <div
                    key={p}
                    className="absolute w-full border-t border-[var(--chart-grid)]"
                    style={{ top: `${p * 100}%` }}
                  />
                ))}
              </div>

              {/* Perfect prediction line */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="100" x2="100" y2="0" stroke="var(--color-border-default)" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
              </div>

              {/* Data points */}
              {actualVsPredicted.slice(0, 200).map((point, i) => {
                const allActuals = actualVsPredicted.map(p => p.actual);
                const allPredicted = actualVsPredicted.map(p => p.predicted);
                const minVal = Math.min(...allActuals, ...allPredicted);
                const maxVal = Math.max(...allActuals, ...allPredicted);
                const range = maxVal - minVal || 1;

                const x = ((point.actual - minVal) / range) * 100;
                const y = (1 - (point.predicted - minVal) / range) * 100;

                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[var(--color-accent-500)] opacity-60"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--color-text-tertiary)]">
              <span>Actual →</span>
              <span>↑ Predicted</span>
            </div>
          </ChartContainer>

          {/* Residuals */}
          <ChartContainer title="Residuals" subtitle="Error distribution">
            <div className="flex items-end justify-center gap-[1px] h-40">
              {(() => {
                // Simple residual histogram
                const bins = 20;
                const binWidth = (maxResidual * 2) / bins;
                const counts = new Array(bins).fill(0);
                for (const r of residuals) {
                  let idx = Math.floor((r + maxResidual) / binWidth);
                  if (idx >= bins) idx = bins - 1;
                  if (idx < 0) idx = 0;
                  counts[idx]++;
                }
                const maxCount = Math.max(...counts, 1);
                return counts.map((count, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{
                      height: `${(count / maxCount) * 100}%`,
                      backgroundColor: i === Math.floor(bins / 2) ? 'var(--color-success-default)' : 'var(--chart-2)',
                      minHeight: count > 0 ? '2px' : '0',
                    }}
                  />
                ));
              })()}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono-metric text-[var(--color-text-tertiary)]">
              <span>{(-maxResidual).toFixed(1)}</span>
              <span>0</span>
              <span>{maxResidual.toFixed(1)}</span>
            </div>
          </ChartContainer>
        </div>
      )}

      {/* Feature importance */}
      {selectedModel?.featureImportances && selectedModel.featureImportances.length > 0 && (
        <ChartContainer
          title="Feature Importance"
          subtitle={getModelDisplayName(selectedModel.modelType as ModelType)}
        >
          <FeatureImportanceChart features={selectedModel.featureImportances} />
        </ChartContainer>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/predict')}
          className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
        >
          Make Predictions
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

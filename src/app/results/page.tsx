"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Activity } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { ChartContainer } from '@/components/app/chart-container';
import { ForecastChart, type ForecastDataPoint } from '@/components/app/forecast-chart';
import { MetricCard } from '@/components/app/metric-card';
import { EmptyState } from '@/components/app/empty-state';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';
import { predictWithConfidence, getModelDisplayName, type ModelType } from '@/lib/ml-service';
import { exportToCsv } from '@/lib/export-utils';

export default function ResultsPage() {
  const router = useRouter();
  const { state } = useAppState();
  
  const models = state.training.models;
  const selectedModel = models.find(m => m.isSelected) || models[0];
  const hasData = state.dataset.parsedData.length > 0;

  // Generate batch predictions for the entire dataset
  const batchResults = useMemo(() => {
    if (!selectedModel || !hasData) return [];

    const numericFeatures = selectedModel.featureColumns.filter(f =>
      state.dataset.columns.find(c => c.name === f && c.type === 'numeric')
    );

    return state.dataset.parsedData.map((row, index) => {
      const numericValues = numericFeatures.map(col => {
        const val = parseFloat(row[col] || '0');
        return isNaN(val) ? 0 : val;
      });

      try {
        const result = predictWithConfidence(
          selectedModel.modelData,
          selectedModel.modelType as ModelType,
          numericValues
        );
        return {
          originalRow: row,
          index,
          prediction: result.prediction,
          lower95: result.lower95,
          upper95: result.upper95
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean) as any[];
  }, [selectedModel, state.dataset, hasData]);

  const chartData: ForecastDataPoint[] = useMemo(() => {
    if (!batchResults.length) return [];
    
    // Attempt to find a time/date column for the X-axis label
    const timeCol = state.dataset.columns.find(c => 
      c.name.toLowerCase().includes('date') || 
      c.name.toLowerCase().includes('time') ||
      c.name.toLowerCase().includes('year') ||
      c.name.toLowerCase().includes('month')
    );

    return batchResults.map((res, i) => {
      const label = timeCol ? res.originalRow[timeCol.name] : `Row ${i + 1}`;
      const actualValStr = res.originalRow[selectedModel?.targetColumn || ''];
      const actual = actualValStr ? parseFloat(actualValStr) : undefined;
      
      return {
        label: String(label).substring(0, 15), // truncate long labels
        actual: !isNaN(actual as number) ? actual : undefined,
        forecast: res.prediction,
        lower95: res.lower95,
        upper95: res.upper95
      };
    });
  }, [batchResults, state.dataset.columns, selectedModel]);

  if (!selectedModel || !hasData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={7} />
        <EmptyState
          icon={Activity}
          title="No Data to Visualize"
          description="You need to upload data and train a model first."
          actionLabel="Go back"
          onAction={() => router.push('/predict')}
        />
      </div>
    );
  }

  const handleExport = () => {
    const exportData = batchResults.map(res => ({
      ...res.originalRow,
      [`Predicted_${selectedModel.targetColumn}`]: res.prediction,
      'Confidence_Lower_95': res.lower95,
      'Confidence_Upper_95': res.upper95
    }));
    exportToCsv(`forecast_results_${selectedModel.targetColumn}.csv`, exportData);
  };

  const avgPrediction = batchResults.reduce((sum, r) => sum + r.prediction, 0) / (batchResults.length || 1);
  const totalPrediction = batchResults.reduce((sum, r) => sum + r.prediction, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={7} />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Results Dashboard
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Batch predictions for your entire dataset using <span className="text-[var(--color-accent-500)] font-medium">{getModelDisplayName(selectedModel.modelType as ModelType)}</span>.
          </p>
        </div>
        <Button onClick={handleExport} className="bg-[var(--color-surface-3)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] gap-2 border border-[var(--color-border-subtle)]">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Rows Analyzed" value={batchResults.length.toLocaleString()} />
        <MetricCard label="Average Predicted Value" value={avgPrediction.toFixed(2)} />
        <MetricCard label="Sum Projected Total" value={totalPrediction.toFixed(2)} />
      </div>

      {/* Visual Chart */}
      <ChartContainer title="Forecast Trend Analysis" subtitle="Actual vs Projected Values with 95% Confidence Interval">
        <div className="pt-4">
          <ForecastChart data={chartData} yAxisLabel={selectedModel.targetColumn} />
        </div>
      </ChartContainer>

      {/* Data Table Preview */}
      <ChartContainer title="Batch Prediction Preview" subtitle="First 10 rows of the batch result">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--color-surface-2)]">
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)]">Row</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)]">Actual {selectedModel.targetColumn}</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-accent-500)] border-b border-[var(--color-border-subtle)]">Predicted Value</th>
                <th className="px-3 py-2 text-left font-semibold text-[var(--color-text-tertiary)] border-b border-[var(--color-border-subtle)]">95% Interval</th>
              </tr>
            </thead>
            <tbody>
              {batchResults.slice(0, 10).map((res, i) => (
                <tr key={i} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-white-05)] transition-colors">
                  <td className="px-3 py-2 text-[var(--color-text-tertiary)] font-mono-metric">{res.index + 1}</td>
                  <td className="px-3 py-2 text-[var(--color-text-secondary)] font-mono-metric">{res.originalRow[selectedModel.targetColumn] || '—'}</td>
                  <td className="px-3 py-2 text-[var(--color-accent-500)] font-bold font-mono-metric">{res.prediction.toFixed(4)}</td>
                  <td className="px-3 py-2 text-[var(--color-text-tertiary)] font-mono-metric">[{res.lower95.toFixed(2)}, {res.upper95.toFixed(2)}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>

    </div>
  );
}

"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Brain, Play, Loader2 } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { ModelCard } from '@/components/app/model-card';
import { EmptyState } from '@/components/app/empty-state';
import { AiInsightCard } from '@/components/app/ai-insight-card';
import { ChartContainer } from '@/components/app/chart-container';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';
import {
  trainAndEvaluateModel,
  detectTaskType,
  REGRESSION_MODELS,
  CLASSIFICATION_MODELS,
  getModelDisplayName,
  type ModelType,
} from '@/lib/ml-service';
import type { TrainedModel, RegressionMetrics, ClassificationMetrics } from '@/store/app-store';

export default function TrainPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [isTraining, setIsTraining] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [targetColumn, setTargetColumn] = useState(state.dataset.suggestedTargetColumn || '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(state.dataset.suggestedFeatureColumns);

  const { headers, parsedData, meta, columns } = state.dataset;
  const hasData = !!meta;
  const numericColumns = columns.filter(c => c.type === 'numeric');

  const csvData = state.dataset.cleanedCsv || state.dataset.rawCsv || '';

  const handleTrain = useCallback(async () => {
    if (!targetColumn || selectedFeatures.length === 0 || !csvData) return;

    setIsTraining(true);
    dispatch({ type: 'CLEAR_MODELS' });

    // Detect task type from target column values
    const targetValues = parsedData
      .map(r => parseFloat(r[targetColumn]))
      .filter(v => !isNaN(v));
    const taskType = detectTaskType(targetValues);
    const modelTypes = taskType === 'regression' ? REGRESSION_MODELS : CLASSIFICATION_MODELS;

    const results: TrainedModel[] = [];

    for (let i = 0; i < modelTypes.length; i++) {
      const modelType = modelTypes[i];
      setCurrentModel(getModelDisplayName(modelType));
      setProgress(((i) / modelTypes.length) * 100);

      // Yield to UI to show progress
      await new Promise(r => setTimeout(r, 50));

      try {
        const result = trainAndEvaluateModel({
          csvData,
          targetColumn,
          featureColumns: selectedFeatures.filter(f => numericColumns.some(nc => nc.name === f)),
          modelType,
        });

        const trainedModel: TrainedModel = {
          id: crypto.randomUUID(),
          modelType: modelType,
          taskType: result.taskType,
          targetColumn,
          featureColumns: selectedFeatures,
          trainedAt: new Date().toISOString(),
          trainingTimeMs: result.trainingTime,
          metrics: result.metrics,
          predictions: result.predictions,
          actuals: result.actuals,
          featureImportances: result.featureImportances,
          isSelected: false,
          rank: null,
          modelData: result.modelData,
        };

        results.push(trainedModel);
        dispatch({ type: 'ADD_MODEL', payload: trainedModel });
      } catch (err) {
        console.error(`Failed to train ${modelType}:`, err);
      }
    }

    // Rank models
    if (results.length > 0) {
      const ranked = [...results].sort((a, b) => {
        if (taskType === 'regression') {
          return (b.metrics as RegressionMetrics).r2 - (a.metrics as RegressionMetrics).r2;
        }
        return (b.metrics as ClassificationMetrics).accuracy - (a.metrics as ClassificationMetrics).accuracy;
      });

      const rankedModels = ranked.map((m, i) => ({
        ...m,
        rank: i + 1,
        isSelected: i === 0,
      }));

      dispatch({ type: 'SET_MODELS', payload: rankedModels });
      dispatch({ type: 'SELECT_MODEL', payload: rankedModels[0].id });
    }

    setProgress(100);
    setCurrentModel('');
    setIsTraining(false);
  }, [targetColumn, selectedFeatures, csvData, parsedData, numericColumns, dispatch]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  if (!hasData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={4} />
        <EmptyState
          icon={Brain}
          title="No Data to Train On"
          description="Upload and optionally clean a dataset first."
          actionLabel="Go to Upload"
          onAction={() => router.push('/upload')}
        />
      </div>
    );
  }

  const models = state.training.models;
  const hasModels = models.length > 0;
  const isRegression = hasModels && models[0].taskType === 'regression';

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={4} />

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Train Models
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Select target and features, then run all 5 algorithms.
        </p>
      </div>

      {/* Config panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target column */}
        <ChartContainer title="Target Column" subtitle="What to predict">
          <select
            value={targetColumn}
            onChange={e => setTargetColumn(e.target.value)}
            disabled={isTraining}
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-default)] rounded-md px-3 py-2 text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-accent-500)]"
          >
            <option value="">Select target column...</option>
            {numericColumns.map(col => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>
          {state.dataset.suggestedTargetColumn && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              Suggested: <span className="text-[var(--color-accent-500)]">{state.dataset.suggestedTargetColumn}</span>
            </p>
          )}
        </ChartContainer>

        {/* Feature selection */}
        <ChartContainer title="Feature Columns" subtitle={`${selectedFeatures.length} selected`}>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {headers.filter(h => h !== targetColumn).map(header => {
              const isNumeric = numericColumns.some(nc => nc.name === header);
              return (
                <label
                  key={header}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                    selectedFeatures.includes(header)
                      ? 'bg-[rgba(232,64,64,0.08)] text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-white-05)]'
                  } ${!isNumeric ? 'opacity-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(header)}
                    onChange={() => toggleFeature(header)}
                    disabled={isTraining || !isNumeric}
                    className="rounded border-[var(--color-border-default)] text-[var(--color-accent-500)]"
                  />
                  {header}
                  {!isNumeric && (
                    <span className="text-[10px] text-[var(--color-text-tertiary)]">(non-numeric)</span>
                  )}
                </label>
              );
            })}
          </div>
        </ChartContainer>
      </div>

      {/* Train button */}
      <Button
        onClick={handleTrain}
        disabled={isTraining || !targetColumn || selectedFeatures.length === 0}
        className="w-full bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2 py-3 text-base"
      >
        {isTraining ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Training {currentModel}... ({Math.round(progress)}%)
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Train All Models
          </>
        )}
      </Button>

      {/* Progress bar */}
      {isTraining && (
        <div className="h-2 bg-[var(--color-surface-3)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent-500)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Results */}
      {hasModels && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Training Results</h2>

          <AiInsightCard title="Model Comparison Summary" source="Automated ranking">
            <p>
              Trained {models.length} models. Best performing:{' '}
              <strong>{getModelDisplayName(models.find(m => m.rank === 1)?.modelType as ModelType || 'linear_regression')}</strong>
              {' '}with {isRegression
                ? `R² = ${((models.find(m => m.rank === 1)?.metrics as RegressionMetrics)?.r2 || 0).toFixed(4)}`
                : `Accuracy = ${(((models.find(m => m.rank === 1)?.metrics as ClassificationMetrics)?.accuracy || 0) * 100).toFixed(1)}%`
              }
            </p>
          </AiInsightCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...models].sort((a, b) => (a.rank || 99) - (b.rank || 99)).map(model => {
              const primaryMetric = isRegression
                ? { label: 'R²', value: (model.metrics as RegressionMetrics).r2 }
                : { label: 'Accuracy', value: (model.metrics as ClassificationMetrics).accuracy };

              const secondaryMetrics = isRegression
                ? [
                    { label: 'RMSE', value: (model.metrics as RegressionMetrics).rmse },
                    { label: 'MAE', value: (model.metrics as RegressionMetrics).mae },
                  ]
                : [
                    { label: 'Precision', value: (model.metrics as ClassificationMetrics).precision },
                    { label: 'F1 Score', value: (model.metrics as ClassificationMetrics).f1Score },
                  ];

              return (
                <ModelCard
                  key={model.id}
                  modelType={model.modelType}
                  taskType={model.taskType}
                  primaryMetric={primaryMetric}
                  secondaryMetrics={secondaryMetrics}
                  trainingTimeMs={model.trainingTimeMs}
                  rank={model.rank}
                  isBest={model.rank === 1}
                  isSelected={model.isSelected}
                  onSelect={() => dispatch({ type: 'SELECT_MODEL', payload: model.id })}
                />
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => router.push('/compare')}
              className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
            >
              Compare Models
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

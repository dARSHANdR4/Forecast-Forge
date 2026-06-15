"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Sparkles, Table } from 'lucide-react';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { PredictionCard } from '@/components/app/prediction-card';
import { ChartContainer } from '@/components/app/chart-container';
import { EmptyState } from '@/components/app/empty-state';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';
import { predictSingle, predictWithConfidence, getModelDisplayName, type ModelType } from '@/lib/ml-service';

export default function PredictPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [lastPrediction, setLastPrediction] = useState<{
    value: number;
    lower95: number;
    upper95: number;
  } | null>(null);

  const models = state.training.models;
  const selectedModel = models.find(m => m.isSelected) || models[0];
  const hasModels = models.length > 0;

  const handlePredict = useCallback(() => {
    if (!selectedModel) return;

    // Gather feature values in the correct order
    const featureValues = selectedModel.featureColumns.map(col => {
      const val = parseFloat(inputValues[col] || '0');
      return isNaN(val) ? 0 : val;
    });

    // Get numeric features only (same as training)
    const numericFeatures = selectedModel.featureColumns.filter(f =>
      state.dataset.columns.find(c => c.name === f && c.type === 'numeric')
    );
    const numericValues = numericFeatures.map(col => {
      const val = parseFloat(inputValues[col] || '0');
      return isNaN(val) ? 0 : val;
    });

    try {
      const result = predictWithConfidence(
        selectedModel.modelData,
        selectedModel.modelType as ModelType,
        numericValues
      );

      setLastPrediction({
        value: result.prediction,
        lower95: result.lower95,
        upper95: result.upper95
      });

      // Save prediction
      dispatch({
        type: 'ADD_PREDICTION',
        payload: {
          id: crypto.randomUUID(),
          modelId: selectedModel.id,
          inputValues: { ...inputValues },
          predictedValue: result.prediction,
          confidenceLower: result.lower95,
          confidenceUpper: result.upper95,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error('Prediction error:', err);
    }
  }, [selectedModel, inputValues, state.dataset.columns, dispatch]);

  if (!hasModels) {
    return (
      <div className="space-y-8 animate-fade-in">
        <WizardStepper currentStep={6} />
        <EmptyState
          icon={TrendingUp}
          title="No Trained Models"
          description="Train models first to make predictions."
          actionLabel="Go to Train"
          onAction={() => router.push('/train')}
        />
      </div>
    );
  }

  const numericFeatures = selectedModel
    ? selectedModel.featureColumns.filter(f =>
        state.dataset.columns.find(c => c.name === f && c.type === 'numeric')
      )
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={6} />

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Make Predictions
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Using: <span className="text-[var(--color-accent-500)] font-medium">
            {getModelDisplayName(selectedModel?.modelType as ModelType)}
          </span>
          {' '}→ Predicting: <span className="font-medium text-[var(--color-text-primary)]">
            {selectedModel?.targetColumn}
          </span>
        </p>
      </div>

      {/* Model selector */}
      <ChartContainer title="Select Model" subtitle="Choose which trained model to use">
        <div className="flex flex-wrap gap-2">
          {models.sort((a, b) => (a.rank || 99) - (b.rank || 99)).map(model => (
            <button
              key={model.id}
              onClick={() => dispatch({ type: 'SELECT_MODEL', payload: model.id })}
              className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                model.isSelected
                  ? 'bg-[var(--color-accent-500)] text-white border-[var(--color-accent-500)]'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]'
              }`}
            >
              {model.rank === 1 && '🏆 '}
              {getModelDisplayName(model.modelType as ModelType)}
            </button>
          ))}
        </div>
      </ChartContainer>

      {/* Input form */}
      <ChartContainer title="Input Values" subtitle="Enter feature values for prediction">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {numericFeatures.map(feature => {
            const colInfo = state.dataset.columns.find(c => c.name === feature);
            return (
              <div key={feature}>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                  {feature}
                </label>
                <input
                  type="number"
                  value={inputValues[feature] || ''}
                  onChange={e => setInputValues(prev => ({ ...prev, [feature]: e.target.value }))}
                  placeholder={colInfo?.mean ? `Avg: ${colInfo.mean.toFixed(2)}` : '0'}
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-default)] rounded-md px-3 py-2 text-sm font-mono-metric text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-[var(--color-accent-500)] focus:border-transparent"
                />
                {colInfo && (
                  <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1 font-mono-metric">
                    Range: {colInfo.min?.toFixed(1)} – {colInfo.max?.toFixed(1)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick fill from dataset */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const filled: Record<string, string> = {};
              numericFeatures.forEach(f => {
                const col = state.dataset.columns.find(c => c.name === f);
                if (col?.mean !== undefined) filled[f] = col.mean.toFixed(4);
              });
              setInputValues(filled);
            }}
            className="text-xs gap-1"
          >
            <Sparkles className="w-3 h-3" /> Fill with Means
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const filled: Record<string, string> = {};
              numericFeatures.forEach(f => {
                const col = state.dataset.columns.find(c => c.name === f);
                if (col?.median !== undefined) filled[f] = col.median.toFixed(4);
              });
              setInputValues(filled);
            }}
            className="text-xs gap-1"
          >
            Fill with Medians
          </Button>
        </div>
      </ChartContainer>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handlePredict}
          className="flex-1 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2 py-3 text-base"
        >
          <TrendingUp className="w-5 h-5" />
          Generate Single Prediction
        </Button>
        <Button
          onClick={() => router.push('/results')}
          variant="outline"
          className="flex-1 gap-2 py-3 text-base border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]"
        >
          <Table className="w-5 h-5" />
          View Batch Results & Export
        </Button>
      </div>

      {/* Prediction result */}
      {lastPrediction && (
        <PredictionCard
          label={`Predicted ${selectedModel?.targetColumn}`}
          value={lastPrediction.value}
          confidenceLower={lastPrediction.lower95 !== lastPrediction.value ? lastPrediction.lower95 : undefined}
          confidenceUpper={lastPrediction.upper95 !== lastPrediction.value ? lastPrediction.upper95 : undefined}
          inputSummary={`Based on ${numericFeatures.length} input features`}
        />
      )}

      {/* Prediction history */}
      {state.predictions.singlePredictions.length > 0 && (
        <ChartContainer
          title="Prediction History"
          subtitle={`${state.predictions.singlePredictions.length} predictions`}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...state.predictions.singlePredictions].reverse().map(pred => (
              <div
                key={pred.id}
                className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface-2)] rounded-lg"
              >
                <div>
                  <p className="text-sm font-mono-metric text-[var(--color-text-primary)]">
                    {typeof pred.predictedValue === 'number' ? pred.predictedValue.toFixed(4) : pred.predictedValue}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">
                    {new Date(pred.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {pred.confidenceLower !== undefined && pred.confidenceUpper !== undefined && (
                  <p className="text-xs text-[var(--color-text-tertiary)] font-mono-metric">
                    [{pred.confidenceLower.toFixed(2)}, {pred.confidenceUpper.toFixed(2)}]
                  </p>
                )}
              </div>
            ))}
          </div>
        </ChartContainer>
      )}
    </div>
  );
}

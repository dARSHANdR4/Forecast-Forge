"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────

export interface DatasetMeta {
  id: string;
  filename: string;
  uploadedAt: string;
  rowCount: number;
  columnCount: number;
  fileSizeBytes: number;
  status: 'uploaded' | 'analyzed' | 'cleaned';
}

export interface ColumnInfo {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean';
  missingCount: number;
  missingPercent: number;
  uniqueCount: number;
  sampleValues: string[];
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  q25?: number;
  q75?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface RegressionMetrics {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
  mape?: number;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix?: number[][];
}

export interface TrainedModel {
  id: string;
  modelType: string;
  taskType: 'regression' | 'classification';
  targetColumn: string;
  featureColumns: string[];
  trainedAt: string;
  trainingTimeMs: number;
  metrics: RegressionMetrics | ClassificationMetrics;
  predictions: number[];
  actuals: number[];
  featureImportances: FeatureImportance[] | null;
  isSelected: boolean;
  rank: number | null;
  modelData?: any; // Serialized model for prediction
}

export interface SinglePrediction {
  id: string;
  modelId: string;
  inputValues: Record<string, number | string>;
  predictedValue: number | string;
  confidenceLower?: number;
  confidenceUpper?: number;
  timestamp: string;
}

export interface AppState {
  // Dataset
  dataset: {
    meta: DatasetMeta | null;
    rawCsv: string | null;
    cleanedCsv: string | null;
    headers: string[];
    parsedData: Record<string, string>[];
    columns: ColumnInfo[];
    suggestedTargetColumn: string | null;
    suggestedFeatureColumns: string[];
    correlationMatrix: number[][] | null;
  };
  // Training
  training: {
    models: TrainedModel[];
    selectedModelId: string | null;
    isTraining: boolean;
    currentlyTraining: string | null;
    progress: number;
  };
  // Predictions
  predictions: {
    singlePredictions: SinglePrediction[];
  };
  // UI
  ui: {
    currentStep: number; // 0-6: dashboard, upload, explore, clean, train, compare, predict
    sidebarCollapsed: boolean;
  };
}

// ─── Initial State ──────────────────────────────────────

const initialState: AppState = {
  dataset: {
    meta: null,
    rawCsv: null,
    cleanedCsv: null,
    headers: [],
    parsedData: [],
    columns: [],
    suggestedTargetColumn: null,
    suggestedFeatureColumns: [],
    correlationMatrix: null,
  },
  training: {
    models: [],
    selectedModelId: null,
    isTraining: false,
    currentlyTraining: null,
    progress: 0,
  },
  predictions: {
    singlePredictions: [],
  },
  ui: {
    currentStep: 0,
    sidebarCollapsed: false,
  },
};

// ─── Actions ────────────────────────────────────────────

type Action =
  | { type: 'SET_DATASET'; payload: Partial<AppState['dataset']> }
  | { type: 'CLEAR_DATASET' }
  | { type: 'SET_COLUMNS'; payload: ColumnInfo[] }
  | { type: 'SET_CORRELATION_MATRIX'; payload: number[][] }
  | { type: 'SET_CLEANED_CSV'; payload: string }
  | { type: 'SET_SUGGESTED_COLUMNS'; payload: { target: string | null; features: string[] } }
  | { type: 'ADD_MODEL'; payload: TrainedModel }
  | { type: 'SET_MODELS'; payload: TrainedModel[] }
  | { type: 'SELECT_MODEL'; payload: string }
  | { type: 'SET_TRAINING_STATE'; payload: Partial<AppState['training']> }
  | { type: 'CLEAR_MODELS' }
  | { type: 'ADD_PREDICTION'; payload: SinglePrediction }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'TOGGLE_SIDEBAR' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DATASET':
      return {
        ...state,
        dataset: { ...state.dataset, ...action.payload },
        training: { ...initialState.training },
        predictions: { ...initialState.predictions },
      };
    case 'CLEAR_DATASET':
      return { ...initialState };
    case 'SET_COLUMNS':
      return {
        ...state,
        dataset: { ...state.dataset, columns: action.payload },
      };
    case 'SET_CORRELATION_MATRIX':
      return {
        ...state,
        dataset: { ...state.dataset, correlationMatrix: action.payload },
      };
    case 'SET_CLEANED_CSV':
      return {
        ...state,
        dataset: {
          ...state.dataset,
          cleanedCsv: action.payload,
          meta: state.dataset.meta
            ? { ...state.dataset.meta, status: 'cleaned' }
            : null,
        },
      };
    case 'SET_SUGGESTED_COLUMNS':
      return {
        ...state,
        dataset: {
          ...state.dataset,
          suggestedTargetColumn: action.payload.target,
          suggestedFeatureColumns: action.payload.features,
        },
      };
    case 'ADD_MODEL':
      return {
        ...state,
        training: {
          ...state.training,
          models: [...state.training.models, action.payload],
        },
      };
    case 'SET_MODELS':
      return {
        ...state,
        training: { ...state.training, models: action.payload },
      };
    case 'SELECT_MODEL':
      return {
        ...state,
        training: {
          ...state.training,
          selectedModelId: action.payload,
          models: state.training.models.map(m => ({
            ...m,
            isSelected: m.id === action.payload,
          })),
        },
      };
    case 'SET_TRAINING_STATE':
      return {
        ...state,
        training: { ...state.training, ...action.payload },
      };
    case 'CLEAR_MODELS':
      return {
        ...state,
        training: { ...initialState.training },
        predictions: { ...initialState.predictions },
      };
    case 'ADD_PREDICTION':
      return {
        ...state,
        predictions: {
          singlePredictions: [...state.predictions.singlePredictions, action.payload],
        },
      };
    case 'SET_STEP':
      return {
        ...state,
        ui: { ...state.ui, currentStep: action.payload },
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
      };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

// Helper selectors
export function useDataset() {
  const { state, dispatch } = useAppState();
  return { dataset: state.dataset, dispatch };
}

export function useTraining() {
  const { state, dispatch } = useAppState();
  return { training: state.training, dispatch };
}

export function usePredictions() {
  const { state, dispatch } = useAppState();
  return { predictions: state.predictions, dispatch };
}

export function useUI() {
  const { state, dispatch } = useAppState();
  return { ui: state.ui, dispatch };
}

/**
 * ML Service — Main orchestrator for training, evaluating, and predicting.
 * Wires up all real ML algorithm implementations.
 * NO MORE Math.random() — all predictions are real.
 */

import {
  fitLinearRegression,
  predictLinearRegression,
  getLinearRegressionImportance,
} from './ml-algorithms/linear-regression';
import {
  fitDecisionTreeRegression,
  fitDecisionTreeClassification,
  predictDecisionTree,
  getDecisionTreeImportance,
} from './ml-algorithms/decision-tree';
import {
  fitRandomForestRegression,
  fitRandomForestClassification,
  predictRandomForest,
  predictRandomForestWithVariance,
  getRandomForestImportance,
} from './ml-algorithms/random-forest';
import {
  fitKNN,
  predictKNN,
} from './ml-algorithms/knn';
import {
  fitSVMClassification,
  fitSVMRegression,
  predictSVM,
  getSVMImportance,
} from './ml-algorithms/svm';
import * as stats from './statistics';
import type { FeatureImportance, RegressionMetrics, ClassificationMetrics } from '@/store/app-store';

// ─── TYPES ──────────────────────────────────────────────

export type ModelType =
  | 'linear_regression'
  | 'decision_tree_regression'
  | 'random_forest_regression'
  | 'knn_regression'
  | 'svm_regression'
  | 'logistic_regression'
  | 'decision_tree_classification'
  | 'random_forest_classification'
  | 'knn_classification'
  | 'svm_classification';

export const REGRESSION_MODELS: ModelType[] = [
  'linear_regression',
  'decision_tree_regression',
  'random_forest_regression',
  'knn_regression',
  'svm_regression',
];

export const CLASSIFICATION_MODELS: ModelType[] = [
  'logistic_regression',
  'decision_tree_classification',
  'random_forest_classification',
  'knn_classification',
  'svm_classification',
];

export function getModelDisplayName(type: ModelType): string {
  const names: Record<ModelType, string> = {
    linear_regression: 'Linear Regression',
    decision_tree_regression: 'Decision Tree',
    random_forest_regression: 'Random Forest',
    knn_regression: 'K-Nearest Neighbors',
    svm_regression: 'Support Vector Machine',
    logistic_regression: 'Logistic Regression',
    decision_tree_classification: 'Decision Tree',
    random_forest_classification: 'Random Forest',
    knn_classification: 'K-Nearest Neighbors',
    svm_classification: 'Support Vector Machine',
  };
  return names[type] || type;
}

export interface TrainingInput {
  csvData: string;
  targetColumn: string;
  featureColumns: string[];
  modelType: ModelType;
}

export interface TrainingResult {
  modelType: ModelType;
  taskType: 'regression' | 'classification';
  metrics: RegressionMetrics | ClassificationMetrics;
  predictions: number[];
  actuals: number[];
  featureImportances: FeatureImportance[] | null;
  trainingTime: number;
  modelData: any;
}

// ─── DATA PREPROCESSING ─────────────────────────────────

function parseCSVToArrays(
  csvData: string,
  targetColumn: string,
  featureColumns: string[]
): { X: number[][]; y: number[]; headers: string[]; parsedData: Record<string, string>[] } {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const targetIdx = headers.indexOf(targetColumn);
  const featureIdxs = featureColumns.map(f => headers.indexOf(f)).filter(i => i !== -1);

  const X: number[][] = [];
  const y: number[] = [];
  const parsedData: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length < headers.length) continue;

    const targetVal = parseFloat(values[targetIdx]);
    if (isNaN(targetVal)) continue;

    const featureVals = featureIdxs.map(idx => {
      const val = parseFloat(values[idx]);
      return isNaN(val) ? 0 : val;
    });

    // Skip rows with all-zero features
    if (featureVals.every(v => v === 0) && featureVals.length > 0) continue;

    X.push(featureVals);
    y.push(targetVal);

    const row: Record<string, string> = {};
    headers.forEach((h, j) => { row[h] = values[j]; });
    parsedData.push(row);
  }

  return { X, y, headers, parsedData };
}

/** Detect if target is classification or regression */
export function detectTaskType(y: number[]): 'regression' | 'classification' {
  const uniqueValues = new Set(y);
  // Classification: few unique values, all integers
  if (uniqueValues.size <= 20 && y.every(v => Number.isInteger(v))) {
    return 'classification';
  }
  return 'regression';
}

/** Train/test split (stratified for classification) */
function trainTestSplit(
  X: number[][],
  y: number[],
  testRatio = 0.2
): { trainX: number[][]; trainY: number[]; testX: number[][]; testY: number[] } {
  const n = X.length;
  const testSize = Math.max(1, Math.floor(n * testRatio));

  // Shuffle indices
  const indices = Array.from({ length: n }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const testIndices = new Set(indices.slice(0, testSize));
  const trainX: number[][] = [];
  const trainY: number[] = [];
  const testX: number[][] = [];
  const testY: number[] = [];

  for (let i = 0; i < n; i++) {
    if (testIndices.has(i)) {
      testX.push(X[i]);
      testY.push(y[i]);
    } else {
      trainX.push(X[i]);
      trainY.push(y[i]);
    }
  }

  return { trainX, trainY, testX, testY };
}

// ─── METRICS ────────────────────────────────────────────

function computeRegressionMetrics(actuals: number[], predictions: number[]): RegressionMetrics {
  const n = actuals.length;
  if (n === 0) return { mse: 0, rmse: 0, mae: 0, r2: 0 };

  let mseSum = 0;
  let maeSum = 0;
  const actualMean = stats.mean(actuals);
  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    const error = actuals[i] - predictions[i];
    mseSum += error ** 2;
    maeSum += Math.abs(error);
    ssTot += (actuals[i] - actualMean) ** 2;
    ssRes += error ** 2;
  }

  const mse = mseSum / n;
  const rmse = Math.sqrt(mse);
  const mae = maeSum / n;
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { mse, rmse, mae, r2: Math.max(-1, Math.min(1, r2)) };
}

function computeClassificationMetrics(actuals: number[], predictions: number[]): ClassificationMetrics {
  const n = actuals.length;
  if (n === 0) return { accuracy: 0, precision: 0, recall: 0, f1Score: 0 };

  let correct = 0;
  const classes = [...new Set([...actuals, ...predictions])].sort((a, b) => a - b);

  for (let i = 0; i < n; i++) {
    if (actuals[i] === predictions[i]) correct++;
  }

  const accuracy = correct / n;

  // Compute per-class precision, recall, F1 (macro average)
  let totalPrecision = 0;
  let totalRecall = 0;
  let totalF1 = 0;

  for (const cls of classes) {
    let tp = 0, fp = 0, fn = 0;
    for (let i = 0; i < n; i++) {
      if (predictions[i] === cls && actuals[i] === cls) tp++;
      else if (predictions[i] === cls && actuals[i] !== cls) fp++;
      else if (predictions[i] !== cls && actuals[i] === cls) fn++;
    }
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;

    totalPrecision += precision;
    totalRecall += recall;
    totalF1 += f1;
  }

  const nClasses = classes.length || 1;

  // Build confusion matrix
  const confusionMatrix: number[][] = classes.map(() => classes.map(() => 0));
  for (let i = 0; i < n; i++) {
    const actualIdx = classes.indexOf(actuals[i]);
    const predIdx = classes.indexOf(predictions[i]);
    if (actualIdx >= 0 && predIdx >= 0) {
      confusionMatrix[actualIdx][predIdx]++;
    }
  }

  return {
    accuracy,
    precision: totalPrecision / nClasses,
    recall: totalRecall / nClasses,
    f1Score: totalF1 / nClasses,
    confusionMatrix,
  };
}

// ─── MAIN TRAINING FUNCTION ─────────────────────────────

export function trainAndEvaluateModel(input: TrainingInput): TrainingResult {
  const startTime = Date.now();
  const { csvData, targetColumn, featureColumns, modelType } = input;

  // Parse data
  const { X, y } = parseCSVToArrays(csvData, targetColumn, featureColumns);

  if (X.length < 10) {
    throw new Error(`Insufficient data: need at least 10 valid rows, got ${X.length}`);
  }

  // Determine task type from model name
  const isClassification = modelType.includes('classification') || modelType === 'logistic_regression';
  const taskType = isClassification ? 'classification' : 'regression';

  // Split data
  const { trainX, trainY, testX, testY } = trainTestSplit(X, y);

  // Train model
  let modelData: any;
  let predictions: number[];
  let featureImportances: FeatureImportance[] | null = null;

  switch (modelType) {
    case 'linear_regression': {
      const model = fitLinearRegression(trainX, trainY, featureColumns);
      predictions = predictLinearRegression(model, testX);
      featureImportances = getLinearRegressionImportance(model);
      modelData = model;
      break;
    }
    case 'decision_tree_regression': {
      const model = fitDecisionTreeRegression(trainX, trainY, featureColumns);
      predictions = predictDecisionTree(model, testX);
      featureImportances = getDecisionTreeImportance(model);
      modelData = model;
      break;
    }
    case 'random_forest_regression': {
      const model = fitRandomForestRegression(trainX, trainY, featureColumns);
      predictions = predictRandomForest(model, testX);
      featureImportances = getRandomForestImportance(model);
      modelData = model;
      break;
    }
    case 'knn_regression': {
      const model = fitKNN(trainX, trainY, featureColumns, 'regression');
      predictions = predictKNN(model, testX);
      featureImportances = null;
      modelData = model;
      break;
    }
    case 'svm_regression': {
      const model = fitSVMRegression(trainX, trainY, featureColumns);
      predictions = predictSVM(model, testX);
      featureImportances = getSVMImportance(model);
      modelData = model;
      break;
    }
    case 'logistic_regression':
    case 'svm_classification': {
      const model = fitSVMClassification(trainX, trainY, featureColumns);
      predictions = predictSVM(model, testX);
      featureImportances = getSVMImportance(model);
      modelData = model;
      break;
    }
    case 'decision_tree_classification': {
      const model = fitDecisionTreeClassification(trainX, trainY, featureColumns);
      predictions = predictDecisionTree(model, testX);
      featureImportances = getDecisionTreeImportance(model);
      modelData = model;
      break;
    }
    case 'random_forest_classification': {
      const model = fitRandomForestClassification(trainX, trainY, featureColumns);
      predictions = predictRandomForest(model, testX);
      featureImportances = getRandomForestImportance(model);
      modelData = model;
      break;
    }
    case 'knn_classification': {
      const model = fitKNN(trainX, trainY, featureColumns, 'classification');
      predictions = predictKNN(model, testX);
      featureImportances = null;
      modelData = model;
      break;
    }
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }

  // Compute metrics
  const metrics = isClassification
    ? computeClassificationMetrics(testY, predictions)
    : computeRegressionMetrics(testY, predictions);

  return {
    modelType,
    taskType,
    metrics,
    predictions,
    actuals: testY,
    featureImportances,
    trainingTime: Date.now() - startTime,
    modelData,
  };
}

/** Generate single prediction from a trained model */
export function predictSingle(
  modelData: any,
  modelType: ModelType,
  featureValues: number[]
): number {
  const X = [featureValues];

  switch (modelType) {
    case 'linear_regression':
      return predictLinearRegression(modelData, X)[0];
    case 'decision_tree_regression':
    case 'decision_tree_classification':
      return predictDecisionTree(modelData, X)[0];
    case 'random_forest_regression':
    case 'random_forest_classification':
      return predictRandomForest(modelData, X)[0];
    case 'knn_regression':
    case 'knn_classification':
      return predictKNN(modelData, X)[0];
    case 'svm_regression':
    case 'logistic_regression':
    case 'svm_classification':
      return predictSVM(modelData, X)[0];
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }
}

/** Get confidence interval for a prediction (Random Forest only) */
export function predictWithConfidence(
  modelData: any,
  modelType: ModelType,
  featureValues: number[]
): { prediction: number; lower95: number; upper95: number } {
  const X = [featureValues];

  if (modelType === 'random_forest_regression') {
    const { predictions, stdDevs } = predictRandomForestWithVariance(modelData, X);
    return {
      prediction: predictions[0],
      lower95: predictions[0] - 1.96 * stdDevs[0],
      upper95: predictions[0] + 1.96 * stdDevs[0],
    };
  }

  // Fallback for other models: no confidence interval
  const pred = predictSingle(modelData, modelType, featureValues);
  return { prediction: pred, lower95: pred, upper95: pred };
}

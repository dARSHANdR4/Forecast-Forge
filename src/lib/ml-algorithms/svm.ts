/**
 * Support Vector Machine — Simplified Linear Kernel
 * Implements a linear SVM using sub-gradient descent (Pegasos-style).
 * Supports binary classification and regression (SVR with epsilon-insensitive loss).
 */

import { standardScale } from '../statistics';

export interface SVMModel {
  type: 'svm';
  taskType: 'regression' | 'classification';
  weights: number[];
  bias: number;
  featureNames: string[];
  scaleMeans: number[];
  scaleStds: number[];
  classMapping?: Map<number, number>; // original -> {-1, 1}
  classReverseMapping?: Map<number, number>; // {-1, 1} -> original
}

interface SVMConfig {
  C?: number;           // Regularization parameter
  learningRate?: number;
  epochs?: number;
  epsilon?: number;     // For SVR
}

const DEFAULT_CONFIG = {
  C: 1.0,
  learningRate: 0.01,
  epochs: 100,
  epsilon: 0.1,
};

// ─── CLASSIFICATION ─────────────────────────────────────

export function fitSVMClassification(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: SVMConfig
): SVMModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const nFeatures = X[0]?.length || 0;

  // Scale features
  const { scaledX, scaleMeans, scaleStds } = scaleFeatures(X, nFeatures);

  // Map classes to {-1, 1} for binary classification
  const uniqueClasses = [...new Set(y)].sort((a, b) => a - b);
  const classMapping = new Map<number, number>();
  const classReverseMapping = new Map<number, number>();

  if (uniqueClasses.length <= 2) {
    classMapping.set(uniqueClasses[0], -1);
    classMapping.set(uniqueClasses[1] ?? uniqueClasses[0], 1);
    classReverseMapping.set(-1, uniqueClasses[0]);
    classReverseMapping.set(1, uniqueClasses[1] ?? uniqueClasses[0]);
  } else {
    // Multi-class: one-vs-rest for the most common class
    const counts = new Map<number, number>();
    for (const val of y) counts.set(val, (counts.get(val) || 0) + 1);
    const sortedClasses = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const positiveClass = sortedClasses[0][0];
    for (const cls of uniqueClasses) {
      classMapping.set(cls, cls === positiveClass ? 1 : -1);
    }
    classReverseMapping.set(1, positiveClass);
    classReverseMapping.set(-1, uniqueClasses.find(c => c !== positiveClass) ?? uniqueClasses[0]);
  }

  const mappedY = y.map(v => classMapping.get(v) ?? -1);

  // Train with Pegasos-style SGD
  const weights = new Array(nFeatures).fill(0);
  let bias = 0;
  const n = scaledX.length;

  for (let epoch = 0; epoch < cfg.epochs; epoch++) {
    const lr = cfg.learningRate / (1 + 0.01 * epoch); // Decay learning rate

    for (let i = 0; i < n; i++) {
      const decision = dotProduct(weights, scaledX[i]) + bias;
      const margin = mappedY[i] * decision;

      if (margin < 1) {
        // Misclassified or within margin
        for (let j = 0; j < nFeatures; j++) {
          weights[j] += lr * (cfg.C * mappedY[i] * scaledX[i][j] - weights[j] / n);
        }
        bias += lr * cfg.C * mappedY[i];
      } else {
        // Correctly classified
        for (let j = 0; j < nFeatures; j++) {
          weights[j] -= lr * weights[j] / n;
        }
      }
    }
  }

  return {
    type: 'svm',
    taskType: 'classification',
    weights,
    bias,
    featureNames,
    scaleMeans,
    scaleStds,
    classMapping,
    classReverseMapping,
  };
}

// ─── REGRESSION (SVR) ───────────────────────────────────

export function fitSVMRegression(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: SVMConfig
): SVMModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const nFeatures = X[0]?.length || 0;

  const { scaledX, scaleMeans, scaleStds } = scaleFeatures(X, nFeatures);

  const weights = new Array(nFeatures).fill(0);
  let bias = 0;
  const n = scaledX.length;

  for (let epoch = 0; epoch < cfg.epochs; epoch++) {
    const lr = cfg.learningRate / (1 + 0.01 * epoch);

    for (let i = 0; i < n; i++) {
      const prediction = dotProduct(weights, scaledX[i]) + bias;
      const error = y[i] - prediction;

      if (Math.abs(error) > cfg.epsilon) {
        const sign = error > 0 ? 1 : -1;
        for (let j = 0; j < nFeatures; j++) {
          weights[j] += lr * (cfg.C * sign * scaledX[i][j] - weights[j] / n);
        }
        bias += lr * cfg.C * sign;
      } else {
        for (let j = 0; j < nFeatures; j++) {
          weights[j] -= lr * weights[j] / n;
        }
      }
    }
  }

  return {
    type: 'svm',
    taskType: 'regression',
    weights,
    bias,
    featureNames,
    scaleMeans,
    scaleStds,
  };
}

// ─── PREDICT ────────────────────────────────────────────

export function predictSVM(model: SVMModel, X: number[][]): number[] {
  return X.map(row => {
    const scaledRow = row.map((v, f) => {
      const std = model.scaleStds[f];
      return std === 0 ? 0 : (v - model.scaleMeans[f]) / std;
    });

    const decision = dotProduct(model.weights, scaledRow) + model.bias;

    if (model.taskType === 'classification') {
      const predicted = decision >= 0 ? 1 : -1;
      return model.classReverseMapping?.get(predicted) ?? predicted;
    }

    return decision;
  });
}

export function getSVMImportance(model: SVMModel): { feature: string; importance: number }[] {
  const totalAbsWeight = model.weights.reduce((s, w) => s + Math.abs(w), 0);
  if (totalAbsWeight === 0) {
    return model.featureNames.map(f => ({ feature: f, importance: 1 / model.featureNames.length }));
  }
  return model.featureNames.map((name, i) => ({
    feature: name,
    importance: Math.abs(model.weights[i]) / totalAbsWeight,
  }));
}

// ─── HELPERS ────────────────────────────────────────────

function scaleFeatures(X: number[][], nFeatures: number) {
  const scaleMeans: number[] = [];
  const scaleStds: number[] = [];
  const scaledX: number[][] = X.map(row => [...row]);

  for (let f = 0; f < nFeatures; f++) {
    const colValues = X.map(row => row[f]);
    const { scaled, mean, std } = standardScale(colValues);
    scaleMeans.push(mean);
    scaleStds.push(std);
    for (let i = 0; i < X.length; i++) {
      scaledX[i][f] = scaled[i];
    }
  }

  return { scaledX, scaleMeans, scaleStds };
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * (b[i] || 0);
  }
  return sum;
}

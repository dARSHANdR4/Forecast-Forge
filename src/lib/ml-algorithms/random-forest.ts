/**
 * Random Forest — Bagged ensemble of CART Decision Trees.
 * Supports regression and classification with bootstrap aggregation.
 */

import {
  fitDecisionTreeRegression,
  fitDecisionTreeClassification,
  predictDecisionTree,
  type DecisionTreeModel,
} from './decision-tree';

export interface RandomForestModel {
  type: 'random_forest';
  trees: DecisionTreeModel[];
  taskType: 'regression' | 'classification';
  featureNames: string[];
  nEstimators: number;
  featureImportances: number[];
}

interface RandomForestConfig {
  nEstimators?: number;
  maxDepth?: number;
  minSamplesLeaf?: number;
  maxFeatures?: number; // Number of features to consider per tree
  bootstrapRatio?: number;
}

const DEFAULT_CONFIG = {
  nEstimators: 30,
  maxDepth: 8,
  minSamplesLeaf: 5,
  bootstrapRatio: 0.8,
};

/** Bootstrap sample (sample with replacement) */
function bootstrapSample(
  X: number[][],
  y: number[],
  ratio: number
): { X: number[][]; y: number[] } {
  const n = Math.floor(X.length * ratio);
  const sampledX: number[][] = [];
  const sampledY: number[] = [];

  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * X.length);
    sampledX.push(X[idx]);
    sampledY.push(y[idx]);
  }

  return { X: sampledX, y: sampledY };
}

/** Select random subset of features */
function selectFeatures(
  X: number[][],
  nFeatures: number,
  totalFeatures: number
): { X: number[][]; featureIndices: number[] } {
  const indices: number[] = [];
  const available = Array.from({ length: totalFeatures }, (_, i) => i);

  // Fisher-Yates shuffle + take first nFeatures
  for (let i = available.length - 1; i > 0 && indices.length < nFeatures; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
    indices.push(available[i]);
  }
  if (indices.length < nFeatures) {
    indices.push(...available.slice(0, nFeatures - indices.length));
  }

  indices.sort((a, b) => a - b);

  const selectedX = X.map(row => indices.map(i => row[i]));
  return { X: selectedX, featureIndices: indices };
}

// ─── REGRESSION FOREST ──────────────────────────────────

export function fitRandomForestRegression(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: RandomForestConfig
): RandomForestModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const nFeatures = X[0]?.length || 0;
  const maxFeat = cfg.maxFeatures || Math.max(Math.floor(nFeatures / 3), 1);

  const trees: DecisionTreeModel[] = [];
  const aggregatedImportances = new Array(nFeatures).fill(0);

  for (let i = 0; i < cfg.nEstimators; i++) {
    const sample = bootstrapSample(X, y, cfg.bootstrapRatio);
    const { X: subX, featureIndices } = selectFeatures(sample.X, Math.min(maxFeat, nFeatures), nFeatures);
    const subFeatureNames = featureIndices.map(idx => featureNames[idx]);

    const tree = fitDecisionTreeRegression(subX, sample.y, subFeatureNames, {
      maxDepth: cfg.maxDepth,
      minSamplesLeaf: cfg.minSamplesLeaf,
    });

    // Store feature index mapping on the tree for prediction
    (tree as any)._featureIndices = featureIndices;
    trees.push(tree);

    // Aggregate importances
    for (let j = 0; j < featureIndices.length; j++) {
      aggregatedImportances[featureIndices[j]] += tree.featureImportances[j];
    }
  }

  // Normalize
  const total = aggregatedImportances.reduce((s, v) => s + v, 0);
  const normalizedImportances = total > 0
    ? aggregatedImportances.map(v => v / total)
    : aggregatedImportances.map(() => 1 / nFeatures);

  return {
    type: 'random_forest',
    trees,
    taskType: 'regression',
    featureNames,
    nEstimators: cfg.nEstimators,
    featureImportances: normalizedImportances,
  };
}

// ─── CLASSIFICATION FOREST ──────────────────────────────

export function fitRandomForestClassification(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: RandomForestConfig
): RandomForestModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const nFeatures = X[0]?.length || 0;
  const maxFeat = cfg.maxFeatures || Math.max(Math.floor(Math.sqrt(nFeatures)), 1);

  const trees: DecisionTreeModel[] = [];
  const aggregatedImportances = new Array(nFeatures).fill(0);

  for (let i = 0; i < cfg.nEstimators; i++) {
    const sample = bootstrapSample(X, y, cfg.bootstrapRatio);
    const { X: subX, featureIndices } = selectFeatures(sample.X, Math.min(maxFeat, nFeatures), nFeatures);
    const subFeatureNames = featureIndices.map(idx => featureNames[idx]);

    const tree = fitDecisionTreeClassification(subX, sample.y, subFeatureNames, {
      maxDepth: cfg.maxDepth,
      minSamplesLeaf: cfg.minSamplesLeaf,
    });

    (tree as any)._featureIndices = featureIndices;
    trees.push(tree);

    for (let j = 0; j < featureIndices.length; j++) {
      aggregatedImportances[featureIndices[j]] += tree.featureImportances[j];
    }
  }

  const total = aggregatedImportances.reduce((s, v) => s + v, 0);
  const normalizedImportances = total > 0
    ? aggregatedImportances.map(v => v / total)
    : aggregatedImportances.map(() => 1 / nFeatures);

  return {
    type: 'random_forest',
    trees,
    taskType: 'classification',
    featureNames,
    nEstimators: cfg.nEstimators,
    featureImportances: normalizedImportances,
  };
}

// ─── PREDICTION ─────────────────────────────────────────

export function predictRandomForest(model: RandomForestModel, X: number[][]): number[] {
  if (model.taskType === 'regression') {
    return X.map(row => {
      const treePreds = model.trees.map(tree => {
        const featureIndices = (tree as any)._featureIndices as number[];
        const subRow = featureIndices ? featureIndices.map(i => row[i]) : row;
        return predictDecisionTree(tree, [subRow])[0];
      });
      return treePreds.reduce((s, v) => s + v, 0) / treePreds.length;
    });
  }

  // Classification: majority vote
  return X.map(row => {
    const treePreds = model.trees.map(tree => {
      const featureIndices = (tree as any)._featureIndices as number[];
      const subRow = featureIndices ? featureIndices.map(i => row[i]) : row;
      return predictDecisionTree(tree, [subRow])[0];
    });
    const counts = new Map<number, number>();
    for (const p of treePreds) counts.set(p, (counts.get(p) || 0) + 1);
    let maxCount = 0;
    let result = treePreds[0];
    for (const [val, count] of counts) {
      if (count > maxCount) { maxCount = count; result = val; }
    }
    return result;
  });
}

/** Get per-tree predictions for confidence intervals */
export function predictRandomForestWithVariance(
  model: RandomForestModel,
  X: number[][]
): { predictions: number[]; stdDevs: number[] } {
  const allTreePreds: number[][] = X.map(() => []);

  for (const tree of model.trees) {
    const featureIndices = (tree as any)._featureIndices as number[];
    for (let i = 0; i < X.length; i++) {
      const subRow = featureIndices ? featureIndices.map(idx => X[i][idx]) : X[i];
      const pred = predictDecisionTree(tree, [subRow])[0];
      allTreePreds[i].push(pred);
    }
  }

  const predictions = allTreePreds.map(preds =>
    preds.reduce((s, v) => s + v, 0) / preds.length
  );

  const stdDevs = allTreePreds.map(preds => {
    const mean = preds.reduce((s, v) => s + v, 0) / preds.length;
    const variance = preds.reduce((s, v) => s + (v - mean) ** 2, 0) / preds.length;
    return Math.sqrt(variance);
  });

  return { predictions, stdDevs };
}

export function getRandomForestImportance(model: RandomForestModel): { feature: string; importance: number }[] {
  return model.featureNames.map((name, i) => ({
    feature: name,
    importance: model.featureImportances[i],
  }));
}

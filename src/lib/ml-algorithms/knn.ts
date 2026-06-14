/**
 * K-Nearest Neighbors (KNN) — Euclidean distance based.
 * Supports regression (average) and classification (majority vote).
 * Includes built-in standard scaling.
 */

import { standardScale } from '../statistics';

export interface KNNModel {
  type: 'knn';
  taskType: 'regression' | 'classification';
  k: number;
  trainX: number[][];
  trainY: number[];
  featureNames: string[];
  scaleMeans: number[];
  scaleStds: number[];
}

interface KNNConfig {
  k?: number;
}

// ─── FIT ────────────────────────────────────────────────

export function fitKNN(
  X: number[][],
  y: number[],
  featureNames: string[],
  taskType: 'regression' | 'classification',
  config?: KNNConfig
): KNNModel {
  const k = config?.k || Math.max(3, Math.min(Math.floor(Math.sqrt(X.length)), 15));
  const nFeatures = X[0]?.length || 0;

  // Standard scale features
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

  return {
    type: 'knn',
    taskType,
    k,
    trainX: scaledX,
    trainY: y,
    featureNames,
    scaleMeans,
    scaleStds,
  };
}

// ─── PREDICT ────────────────────────────────────────────

export function predictKNN(model: KNNModel, X: number[][]): number[] {
  return X.map(row => {
    // Scale the input row
    const scaledRow = row.map((v, f) => {
      const std = model.scaleStds[f];
      return std === 0 ? 0 : (v - model.scaleMeans[f]) / std;
    });

    // Compute distances to all training points
    const distances: { dist: number; y: number }[] = [];
    for (let i = 0; i < model.trainX.length; i++) {
      let dist = 0;
      for (let f = 0; f < scaledRow.length; f++) {
        dist += (scaledRow[f] - model.trainX[i][f]) ** 2;
      }
      distances.push({ dist: Math.sqrt(dist), y: model.trainY[i] });
    }

    // Sort by distance and take k nearest
    distances.sort((a, b) => a.dist - b.dist);
    const neighbors = distances.slice(0, model.k);

    if (model.taskType === 'regression') {
      // Weighted average (inverse distance weighting)
      let weightSum = 0;
      let valSum = 0;
      for (const n of neighbors) {
        const weight = n.dist === 0 ? 1e6 : 1 / n.dist;
        weightSum += weight;
        valSum += weight * n.y;
      }
      return weightSum === 0 ? 0 : valSum / weightSum;
    }

    // Classification: majority vote
    const counts = new Map<number, number>();
    for (const n of neighbors) {
      counts.set(n.y, (counts.get(n.y) || 0) + 1);
    }
    let maxCount = 0;
    let result = neighbors[0].y;
    for (const [val, count] of counts) {
      if (count > maxCount) { maxCount = count; result = val; }
    }
    return result;
  });
}

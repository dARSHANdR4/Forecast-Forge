/**
 * Decision Tree — CART (Classification and Regression Trees)
 * Supports both regression (MSE) and classification (Gini impurity).
 */

interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  value?: number | string;  // Leaf prediction
  impurityDecrease?: number;
}

export interface DecisionTreeModel {
  type: 'decision_tree';
  tree: TreeNode;
  taskType: 'regression' | 'classification';
  featureNames: string[];
  maxDepth: number;
  featureImportances: number[];
}

interface TreeConfig {
  maxDepth?: number;
  minSamplesLeaf?: number;
  minSamplesSplit?: number;
}

const DEFAULT_CONFIG: Required<TreeConfig> = {
  maxDepth: 10,
  minSamplesLeaf: 5,
  minSamplesSplit: 10,
};

// ─── REGRESSION TREE ────────────────────────────────────

export function fitDecisionTreeRegression(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: TreeConfig
): DecisionTreeModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const featureImportances = new Array(featureNames.length).fill(0);

  const tree = buildRegressionTree(X, y, 0, cfg, featureImportances);

  // Normalize importances
  const totalImp = featureImportances.reduce((s, v) => s + v, 0);
  const normalizedImportances = totalImp > 0
    ? featureImportances.map(v => v / totalImp)
    : featureImportances.map(() => 1 / featureNames.length);

  return {
    type: 'decision_tree',
    tree,
    taskType: 'regression',
    featureNames,
    maxDepth: cfg.maxDepth,
    featureImportances: normalizedImportances,
  };
}

function buildRegressionTree(
  X: number[][],
  y: number[],
  depth: number,
  config: Required<TreeConfig>,
  importances: number[]
): TreeNode {
  const n = y.length;

  // Leaf conditions
  if (n <= config.minSamplesLeaf || depth >= config.maxDepth || n < config.minSamplesSplit) {
    return { value: arrayMean(y) };
  }

  // Check if all values are the same
  if (new Set(y).size === 1) {
    return { value: y[0] };
  }

  const nFeatures = X[0]?.length || 0;
  let bestFeature = -1;
  let bestThreshold = 0;
  let bestMSE = Infinity;
  let bestLeftIdx: number[] = [];
  let bestRightIdx: number[] = [];

  const parentMSE = computeMSE(y);

  for (let f = 0; f < nFeatures; f++) {
    // Get unique sorted values for thresholds
    const uniqueVals = [...new Set(X.map(row => row[f]))].sort((a, b) => a - b);
    
    // Test midpoints between unique values
    for (let i = 0; i < uniqueVals.length - 1; i++) {
      const threshold = (uniqueVals[i] + uniqueVals[i + 1]) / 2;
      const leftIdx: number[] = [];
      const rightIdx: number[] = [];

      for (let j = 0; j < n; j++) {
        if (X[j][f] <= threshold) leftIdx.push(j);
        else rightIdx.push(j);
      }

      if (leftIdx.length < config.minSamplesLeaf || rightIdx.length < config.minSamplesLeaf) {
        continue;
      }

      const leftY = leftIdx.map(i => y[i]);
      const rightY = rightIdx.map(i => y[i]);
      const weightedMSE = (leftIdx.length * computeMSE(leftY) + rightIdx.length * computeMSE(rightY)) / n;

      if (weightedMSE < bestMSE) {
        bestMSE = weightedMSE;
        bestFeature = f;
        bestThreshold = threshold;
        bestLeftIdx = leftIdx;
        bestRightIdx = rightIdx;
      }
    }
  }

  // No valid split found
  if (bestFeature === -1) {
    return { value: arrayMean(y) };
  }

  // Track feature importance (reduction in impurity)
  importances[bestFeature] += parentMSE - bestMSE;

  const leftX = bestLeftIdx.map(i => X[i]);
  const leftY = bestLeftIdx.map(i => y[i]);
  const rightX = bestRightIdx.map(i => X[i]);
  const rightY = bestRightIdx.map(i => y[i]);

  return {
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildRegressionTree(leftX, leftY, depth + 1, config, importances),
    right: buildRegressionTree(rightX, rightY, depth + 1, config, importances),
  };
}

// ─── CLASSIFICATION TREE ────────────────────────────────

export function fitDecisionTreeClassification(
  X: number[][],
  y: number[],
  featureNames: string[],
  config?: TreeConfig
): DecisionTreeModel {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const featureImportances = new Array(featureNames.length).fill(0);

  const tree = buildClassificationTree(X, y, 0, cfg, featureImportances);

  const totalImp = featureImportances.reduce((s, v) => s + v, 0);
  const normalizedImportances = totalImp > 0
    ? featureImportances.map(v => v / totalImp)
    : featureImportances.map(() => 1 / featureNames.length);

  return {
    type: 'decision_tree',
    tree,
    taskType: 'classification',
    featureNames,
    maxDepth: cfg.maxDepth,
    featureImportances: normalizedImportances,
  };
}

function buildClassificationTree(
  X: number[][],
  y: number[],
  depth: number,
  config: Required<TreeConfig>,
  importances: number[]
): TreeNode {
  const n = y.length;

  if (n <= config.minSamplesLeaf || depth >= config.maxDepth || n < config.minSamplesSplit) {
    return { value: majorityVote(y) };
  }

  if (new Set(y).size === 1) {
    return { value: y[0] };
  }

  const nFeatures = X[0]?.length || 0;
  let bestFeature = -1;
  let bestThreshold = 0;
  let bestGini = Infinity;
  let bestLeftIdx: number[] = [];
  let bestRightIdx: number[] = [];

  const parentGini = giniImpurity(y);

  for (let f = 0; f < nFeatures; f++) {
    const uniqueVals = [...new Set(X.map(row => row[f]))].sort((a, b) => a - b);

    for (let i = 0; i < uniqueVals.length - 1; i++) {
      const threshold = (uniqueVals[i] + uniqueVals[i + 1]) / 2;
      const leftIdx: number[] = [];
      const rightIdx: number[] = [];

      for (let j = 0; j < n; j++) {
        if (X[j][f] <= threshold) leftIdx.push(j);
        else rightIdx.push(j);
      }

      if (leftIdx.length < config.minSamplesLeaf || rightIdx.length < config.minSamplesLeaf) {
        continue;
      }

      const leftY = leftIdx.map(i => y[i]);
      const rightY = rightIdx.map(i => y[i]);
      const weightedGini = (leftIdx.length * giniImpurity(leftY) + rightIdx.length * giniImpurity(rightY)) / n;

      if (weightedGini < bestGini) {
        bestGini = weightedGini;
        bestFeature = f;
        bestThreshold = threshold;
        bestLeftIdx = leftIdx;
        bestRightIdx = rightIdx;
      }
    }
  }

  if (bestFeature === -1) {
    return { value: majorityVote(y) };
  }

  importances[bestFeature] += parentGini - bestGini;

  return {
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildClassificationTree(bestLeftIdx.map(i => X[i]), bestLeftIdx.map(i => y[i]), depth + 1, config, importances),
    right: buildClassificationTree(bestRightIdx.map(i => X[i]), bestRightIdx.map(i => y[i]), depth + 1, config, importances),
  };
}

// ─── PREDICTION ─────────────────────────────────────────

export function predictDecisionTree(model: DecisionTreeModel, X: number[][]): number[] {
  return X.map(row => predictSingle(model.tree, row) as number);
}

function predictSingle(node: TreeNode, row: number[]): number | string {
  if (node.value !== undefined) return node.value;
  if (node.featureIndex === undefined || node.threshold === undefined) return 0;
  if (row[node.featureIndex] <= node.threshold) {
    return predictSingle(node.left!, row);
  }
  return predictSingle(node.right!, row);
}

export function getDecisionTreeImportance(model: DecisionTreeModel): { feature: string; importance: number }[] {
  return model.featureNames.map((name, i) => ({
    feature: name,
    importance: model.featureImportances[i],
  }));
}

// ─── HELPERS ────────────────────────────────────────────

function arrayMean(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((s, v) => s + v, 0) / arr.length;
}

function computeMSE(values: number[]): number {
  const avg = arrayMean(values);
  return arrayMean(values.map(v => (v - avg) ** 2));
}

function giniImpurity(values: number[]): number {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let impurity = 1;
  for (const count of counts.values()) {
    const p = count / values.length;
    impurity -= p * p;
  }
  return impurity;
}

function majorityVote(values: number[]): number {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let maxCount = 0;
  let result = values[0];
  for (const [val, count] of counts) {
    if (count > maxCount) { maxCount = count; result = val; }
  }
  return result;
}

/**
 * Linear Regression — Ordinary Least Squares (Normal Equation)
 * Supports multi-feature regression with real matrix math.
 */

export interface LinearRegressionModel {
  type: 'linear_regression';
  coefficients: number[];
  intercept: number;
  featureNames: string[];
}

/**
 * Solve OLS via the Normal Equation: β = (X^T X)^{-1} X^T y
 * With intercept: prepends a column of 1s to X.
 */
export function fitLinearRegression(
  X: number[][],
  y: number[],
  featureNames: string[]
): LinearRegressionModel {
  const n = X.length;
  const p = X[0]?.length || 0;

  // Add intercept column (column of 1s)
  const Xa: number[][] = X.map(row => [1, ...row]);
  const cols = p + 1;

  // Compute X^T X
  const XtX: number[][] = Array.from({ length: cols }, () => Array(cols).fill(0));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += Xa[k][i] * Xa[k][j];
      }
      XtX[i][j] = sum;
    }
  }

  // Compute X^T y
  const Xty: number[] = Array(cols).fill(0);
  for (let i = 0; i < cols; i++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += Xa[k][i] * y[k];
    }
    Xty[i] = sum;
  }

  // Solve via Gauss-Jordan elimination: [XtX | Xty] -> [I | β]
  const aug: number[][] = XtX.map((row, i) => [...row, Xty[i]]);
  const beta = gaussJordanSolve(aug, cols);

  return {
    type: 'linear_regression',
    intercept: beta[0],
    coefficients: beta.slice(1),
    featureNames,
  };
}

export function predictLinearRegression(model: LinearRegressionModel, X: number[][]): number[] {
  return X.map(row => {
    let pred = model.intercept;
    for (let j = 0; j < model.coefficients.length; j++) {
      pred += model.coefficients[j] * (row[j] || 0);
    }
    return pred;
  });
}

export function getLinearRegressionImportance(model: LinearRegressionModel): { feature: string; importance: number }[] {
  const totalAbsCoeff = model.coefficients.reduce((s, c) => s + Math.abs(c), 0);
  if (totalAbsCoeff === 0) {
    return model.featureNames.map(f => ({ feature: f, importance: 1 / model.featureNames.length }));
  }
  return model.featureNames.map((name, i) => ({
    feature: name,
    importance: Math.abs(model.coefficients[i]) / totalAbsCoeff,
  }));
}

/** Gauss-Jordan elimination for solving linear system */
function gaussJordanSolve(aug: number[][], n: number): number[] {
  // Forward elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxVal = Math.abs(aug[col][col]);
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > maxVal) {
        maxVal = Math.abs(aug[row][col]);
        maxRow = row;
      }
    }
    // Swap rows
    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    }

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-12) {
      // Singular matrix — use ridge regression fallback
      aug[col][col] = 1e-8;
      continue;
    }

    // Scale pivot row
    for (let j = col; j <= n; j++) {
      aug[col][j] /= pivot;
    }

    // Eliminate column
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  return aug.map(row => row[n]);
}

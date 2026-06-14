/**
 * Core statistical functions for Forecast Forge.
 * Pure TypeScript — no external dependencies.
 */

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mode(values: number[]): number {
  if (values.length === 0) return 0;
  const counts = new Map<number, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  let maxCount = 0;
  let modeValue = values[0];
  for (const [val, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      modeValue = val;
    }
  }
  return modeValue;
}

export function variance(values: number[], sample = true): number {
  if (values.length <= 1) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map(v => (v - avg) ** 2);
  const divisor = sample ? values.length - 1 : values.length;
  return squaredDiffs.reduce((sum, v) => sum + v, 0) / divisor;
}

export function stdDev(values: number[], sample = true): number {
  return Math.sqrt(variance(values, sample));
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function min(values: number[]): number {
  return values.length === 0 ? 0 : Math.min(...values);
}

export function max(values: number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

export function sum(values: number[]): number {
  return values.reduce((s, v) => s + v, 0);
}

/** Pearson correlation coefficient between two arrays */
export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const xMean = mean(x.slice(0, n));
  const yMean = mean(y.slice(0, n));

  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff ** 2;
    yDenominator += yDiff ** 2;
  }

  const denominator = Math.sqrt(xDenominator * yDenominator);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/** Z-score of each value in the array */
export function zScores(values: number[]): number[] {
  const avg = mean(values);
  const sd = stdDev(values);
  if (sd === 0) return values.map(() => 0);
  return values.map(v => (v - avg) / sd);
}

/** Interquartile range */
export function iqr(values: number[]): number {
  return percentile(values, 75) - percentile(values, 25);
}

/** Standard scaling (zero mean, unit variance) */
export function standardScale(values: number[]): { scaled: number[]; mean: number; std: number } {
  const m = mean(values);
  const s = stdDev(values);
  if (s === 0) return { scaled: values.map(() => 0), mean: m, std: s };
  return {
    scaled: values.map(v => (v - m) / s),
    mean: m,
    std: s,
  };
}

/** Min-max scaling to [0, 1] */
export function minMaxScale(values: number[]): { scaled: number[]; min: number; max: number } {
  const minVal = min(values);
  const maxVal = max(values);
  const range = maxVal - minVal;
  if (range === 0) return { scaled: values.map(() => 0.5), min: minVal, max: maxVal };
  return {
    scaled: values.map(v => (v - minVal) / range),
    min: minVal,
    max: maxVal,
  };
}

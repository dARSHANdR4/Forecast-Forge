/**
 * Data analysis utilities for EDA (Exploratory Data Analysis).
 * Computes column statistics, type detection, distributions, and correlations.
 */

import * as stats from './statistics';
import type { ColumnInfo } from '@/store/app-store';

/** Detect the type of a column based on its values */
export function detectColumnType(values: string[]): ColumnInfo['type'] {
  const nonEmpty = values.filter(v => v !== '' && v !== null && v !== undefined);
  if (nonEmpty.length === 0) return 'text';

  // Check if boolean
  const boolValues = new Set(['true', 'false', 'yes', 'no', '0', '1']);
  const uniqueLower = new Set(nonEmpty.map(v => v.toLowerCase()));
  if (uniqueLower.size <= 2 && [...uniqueLower].every(v => boolValues.has(v))) {
    return 'boolean';
  }

  // Check if numeric
  const numericCount = nonEmpty.filter(v => !isNaN(parseFloat(v)) && isFinite(Number(v))).length;
  if (numericCount / nonEmpty.length > 0.8) {
    return 'numeric';
  }

  // Check if datetime
  const dateCount = nonEmpty.filter(v => {
    const d = new Date(v);
    return !isNaN(d.getTime()) && v.length > 5;
  }).length;
  if (dateCount / nonEmpty.length > 0.8) {
    return 'datetime';
  }

  // Check if categorical (low cardinality)
  const uniqueRatio = new Set(nonEmpty).size / nonEmpty.length;
  if (uniqueRatio < 0.3 || new Set(nonEmpty).size <= 20) {
    return 'categorical';
  }

  return 'text';
}

/** Compute statistics for a single column */
export function computeColumnStats(name: string, values: string[], totalRows: number): ColumnInfo {
  const type = detectColumnType(values);
  const nonEmpty = values.filter(v => v !== '' && v !== null && v !== undefined);
  const missingCount = totalRows - nonEmpty.length;
  const uniqueValues = new Set(nonEmpty);

  const base: ColumnInfo = {
    name,
    type,
    missingCount,
    missingPercent: totalRows > 0 ? (missingCount / totalRows) * 100 : 0,
    uniqueCount: uniqueValues.size,
    sampleValues: nonEmpty.slice(0, 5),
  };

  if (type === 'numeric') {
    const numericValues = nonEmpty
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (numericValues.length > 0) {
      base.mean = stats.mean(numericValues);
      base.median = stats.median(numericValues);
      base.stdDev = stats.stdDev(numericValues);
      base.min = stats.min(numericValues);
      base.max = stats.max(numericValues);
      base.q25 = stats.percentile(numericValues, 25);
      base.q75 = stats.percentile(numericValues, 75);
    }
  }

  return base;
}

/** Compute statistics for all columns in parsed data */
export function analyzeDataset(
  headers: string[],
  data: Record<string, string>[]
): ColumnInfo[] {
  return headers.map(header => {
    const values = data.map(row => row[header] || '');
    return computeColumnStats(header, values, data.length);
  });
}

/** Compute histogram distribution for a numeric column */
export function computeHistogram(
  values: number[],
  bins: number = 20
): { min: number; max: number; binWidth: number; counts: { binStart: number; binEnd: number; count: number }[] } {
  if (values.length === 0) {
    return { min: 0, max: 0, binWidth: 0, counts: [] };
  }

  const minVal = stats.min(values);
  const maxVal = stats.max(values);
  const range = maxVal - minVal;
  const binWidth = range === 0 ? 1 : range / bins;

  const counts: { binStart: number; binEnd: number; count: number }[] = [];
  for (let i = 0; i < bins; i++) {
    const binStart = minVal + i * binWidth;
    const binEnd = binStart + binWidth;
    counts.push({ binStart, binEnd, count: 0 });
  }

  for (const v of values) {
    let binIndex = Math.floor((v - minVal) / binWidth);
    if (binIndex >= bins) binIndex = bins - 1;
    if (binIndex < 0) binIndex = 0;
    counts[binIndex].count++;
  }

  return { min: minVal, max: maxVal, binWidth, counts };
}

/** Compute correlation matrix for numeric columns */
export function computeCorrelationMatrix(
  headers: string[],
  data: Record<string, string>[]
): { columns: string[]; matrix: number[][] } {
  // Filter to numeric columns only
  const numericHeaders = headers.filter(header => {
    const values = data.map(row => row[header] || '');
    return detectColumnType(values) === 'numeric';
  });

  // Extract numeric arrays
  const numericArrays: number[][] = numericHeaders.map(header =>
    data.map(row => parseFloat(row[header] || '') || 0)
  );

  // Build matrix
  const n = numericHeaders.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else if (j > i) {
        const corr = stats.pearsonCorrelation(numericArrays[i], numericArrays[j]);
        matrix[i][j] = corr;
        matrix[j][i] = corr;
      }
    }
  }

  return { columns: numericHeaders, matrix };
}

/** Count duplicate rows in dataset */
export function countDuplicates(data: Record<string, string>[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  for (const row of data) {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  }
  return duplicates;
}

/** Heuristic-based column inference (replaces Genkit AI) */
export function inferColumns(
  headers: string[],
  data: Record<string, string>[],
  columns: ColumnInfo[]
): { targetColumn: string | null; featureColumns: string[] } {
  // Heuristic: the target is the last numeric column, or a column
  // with keywords like 'target', 'label', 'price', 'salary', 'outcome'
  const targetKeywords = ['target', 'label', 'price', 'salary', 'outcome', 'result', 'class',
    'prediction', 'output', 'value', 'score', 'rating', 'revenue', 'profit', 'cost', 'sales'];

  let targetColumn: string | null = null;

  // First: check for keyword matches
  for (const col of columns) {
    const nameLower = col.name.toLowerCase();
    if (targetKeywords.some(kw => nameLower.includes(kw))) {
      targetColumn = col.name;
      break;
    }
  }

  // Fallback: last numeric column
  if (!targetColumn) {
    const numericCols = columns.filter(c => c.type === 'numeric');
    if (numericCols.length > 0) {
      targetColumn = numericCols[numericCols.length - 1].name;
    }
  }

  // Features: all columns except target, with preference for numeric ones
  const featureColumns = headers.filter(h => h !== targetColumn);

  return { targetColumn, featureColumns };
}

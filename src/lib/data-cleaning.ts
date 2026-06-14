/**
 * Data cleaning utilities.
 * Handles missing values, outliers, and categorical encoding.
 */

import * as stats from './statistics';

type CleaningStrategy = 'drop' | 'fill_mean' | 'fill_median' | 'fill_mode' | 'forward_fill';
type OutlierMethod = 'zscore' | 'iqr';
type OutlierStrategy = 'remove' | 'clip' | 'cap';
type EncodingMethod = 'label' | 'onehot';

/** Handle missing values in a dataset */
export function handleMissingValues(
  data: Record<string, string>[],
  column: string,
  strategy: CleaningStrategy
): Record<string, string>[] {
  switch (strategy) {
    case 'drop':
      return data.filter(row => row[column] !== '' && row[column] !== undefined && row[column] !== null);

    case 'fill_mean': {
      const values = data.map(r => parseFloat(r[column])).filter(v => !isNaN(v));
      const fillValue = stats.mean(values).toString();
      return data.map(row => ({
        ...row,
        [column]: (row[column] === '' || row[column] === undefined) ? fillValue : row[column],
      }));
    }

    case 'fill_median': {
      const values = data.map(r => parseFloat(r[column])).filter(v => !isNaN(v));
      const fillValue = stats.median(values).toString();
      return data.map(row => ({
        ...row,
        [column]: (row[column] === '' || row[column] === undefined) ? fillValue : row[column],
      }));
    }

    case 'fill_mode': {
      const nonEmpty = data.map(r => r[column]).filter(v => v !== '' && v !== undefined);
      const counts = new Map<string, number>();
      for (const v of nonEmpty) counts.set(v, (counts.get(v) || 0) + 1);
      let modeValue = nonEmpty[0] || '';
      let maxCount = 0;
      for (const [val, count] of counts) {
        if (count > maxCount) { maxCount = count; modeValue = val; }
      }
      return data.map(row => ({
        ...row,
        [column]: (row[column] === '' || row[column] === undefined) ? modeValue : row[column],
      }));
    }

    case 'forward_fill': {
      let lastValue = '';
      return data.map(row => {
        if (row[column] !== '' && row[column] !== undefined) {
          lastValue = row[column];
          return row;
        }
        return { ...row, [column]: lastValue };
      });
    }

    default:
      return data;
  }
}

/** Detect outliers in a numeric column */
export function detectOutliers(
  data: Record<string, string>[],
  column: string,
  method: OutlierMethod = 'zscore',
  threshold: number = 3
): { indices: number[]; count: number } {
  const values = data.map(r => parseFloat(r[column]));
  const indices: number[] = [];

  if (method === 'zscore') {
    const zScores = stats.zScores(values.filter(v => !isNaN(v)));
    let j = 0;
    for (let i = 0; i < values.length; i++) {
      if (!isNaN(values[i])) {
        if (Math.abs(zScores[j]) > threshold) {
          indices.push(i);
        }
        j++;
      }
    }
  } else if (method === 'iqr') {
    const validValues = values.filter(v => !isNaN(v));
    const q1 = stats.percentile(validValues, 25);
    const q3 = stats.percentile(validValues, 75);
    const iqrVal = q3 - q1;
    const lower = q1 - threshold * iqrVal;
    const upper = q3 + threshold * iqrVal;

    for (let i = 0; i < values.length; i++) {
      if (!isNaN(values[i]) && (values[i] < lower || values[i] > upper)) {
        indices.push(i);
      }
    }
  }

  return { indices, count: indices.length };
}

/** Handle outliers in a numeric column */
export function handleOutliers(
  data: Record<string, string>[],
  column: string,
  strategy: OutlierStrategy,
  method: OutlierMethod = 'zscore',
  threshold: number = 3
): Record<string, string>[] {
  const { indices } = detectOutliers(data, column, method, threshold);
  const indexSet = new Set(indices);

  if (strategy === 'remove') {
    return data.filter((_, i) => !indexSet.has(i));
  }

  if (strategy === 'clip' || strategy === 'cap') {
    const validValues = data
      .filter((_, i) => !indexSet.has(i))
      .map(r => parseFloat(r[column]))
      .filter(v => !isNaN(v));

    const lowerBound = stats.percentile(validValues, 5);
    const upperBound = stats.percentile(validValues, 95);

    return data.map((row, i) => {
      if (!indexSet.has(i)) return row;
      const val = parseFloat(row[column]);
      const clipped = Math.min(Math.max(val, lowerBound), upperBound);
      return { ...row, [column]: clipped.toString() };
    });
  }

  return data;
}

/** Encode categorical column */
export function encodeCategorical(
  data: Record<string, string>[],
  column: string,
  method: EncodingMethod = 'label'
): { data: Record<string, string>[]; mapping?: Record<string, number>; newColumns?: string[] } {
  const uniqueValues = [...new Set(data.map(r => r[column]).filter(v => v !== ''))];

  if (method === 'label') {
    const mapping: Record<string, number> = {};
    uniqueValues.forEach((val, idx) => { mapping[val] = idx; });

    const newData = data.map(row => ({
      ...row,
      [column]: mapping[row[column]]?.toString() ?? row[column],
    }));

    return { data: newData, mapping };
  }

  if (method === 'onehot') {
    const newColumns = uniqueValues.map(v => `${column}_${v}`);
    const newData = data.map(row => {
      const expanded: Record<string, string> = { ...row };
      for (const val of uniqueValues) {
        expanded[`${column}_${val}`] = row[column] === val ? '1' : '0';
      }
      delete expanded[column];
      return expanded;
    });

    return { data: newData, newColumns };
  }

  return { data };
}

/** Detect all data quality issues in a dataset */
export function detectIssues(
  data: Record<string, string>[],
  headers: string[]
): {
  missingColumns: { column: string; count: number; percent: number }[];
  outlierColumns: { column: string; count: number }[];
  categoricalColumns: string[];
  totalIssues: number;
} {
  const missingColumns: { column: string; count: number; percent: number }[] = [];
  const outlierColumns: { column: string; count: number }[] = [];
  const categoricalColumns: string[] = [];

  for (const header of headers) {
    // Missing values
    const missing = data.filter(r => !r[header] || r[header] === '').length;
    if (missing > 0) {
      missingColumns.push({
        column: header,
        count: missing,
        percent: (missing / data.length) * 100,
      });
    }

    // Check if numeric for outlier detection
    const values = data.map(r => r[header]).filter(v => v !== '');
    const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
    const isNumeric = numericCount / Math.max(values.length, 1) > 0.8;

    if (isNumeric && values.length > 10) {
      const { count } = detectOutliers(data, header, 'zscore', 3);
      if (count > 0) {
        outlierColumns.push({ column: header, count });
      }
    }

    // Categorical detection
    if (!isNumeric && new Set(values).size <= 20 && values.length > 0) {
      categoricalColumns.push(header);
    }
  }

  const totalIssues = missingColumns.length + outlierColumns.length + categoricalColumns.length;

  return { missingColumns, outlierColumns, categoricalColumns, totalIssues };
}

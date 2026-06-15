"use client";

import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export interface ForecastDataPoint {
  label: string;
  actual?: number;
  forecast?: number;
  lower95?: number;
  upper95?: number;
}

interface ForecastChartProps {
  data: ForecastDataPoint[];
  height?: number;
  yAxisLabel?: string;
}

export function ForecastChart({ data, height = 400, yAxisLabel }: ForecastChartProps) {
  // Process data for the Area chart (requires array [min, max] for the band)
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      // Create a specific key for the confidence band area
      confidenceBand: (d.lower95 !== undefined && d.upper95 !== undefined) 
        ? [d.lower95, d.upper95] 
        : undefined
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border-subtle)]" style={{ height }}>
        <p className="text-sm text-[var(--color-text-tertiary)]">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis 
            dataKey="label" 
            stroke="var(--color-text-tertiary)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="var(--color-text-tertiary)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
            domain={['auto', 'auto']}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--color-text-tertiary)' } : undefined}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--chart-tooltip-bg)',
              borderColor: 'var(--chart-tooltip-border)',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: 'var(--color-text-primary)' }}
            labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Confidence Band Area */}
          <Area
            type="monotone"
            dataKey="confidenceBand"
            fill="var(--color-accent-500)"
            stroke="none"
            fillOpacity={0.15}
            name="95% Confidence Interval"
            activeDot={false}
          />
          
          {/* Historical Actuals Line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--color-text-secondary)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--color-text-secondary)', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name="Actual"
            connectNulls
          />
          
          {/* Forecast Line */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="var(--color-accent-500)"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: 'var(--color-accent-500)', strokeWidth: 0 }}
            activeDot={{ r: 6, stroke: 'var(--color-white-100)', strokeWidth: 2 }}
            name="Forecast"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

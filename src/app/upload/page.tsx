"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { UploadZone } from '@/components/app/upload-zone';
import { WizardStepper } from '@/components/app/wizard-stepper';
import { AiInsightCard } from '@/components/app/ai-insight-card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/store/app-store';
import { analyzeDataset, inferColumns } from '@/lib/data-analysis';

export default function UploadPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [columnSummary, setColumnSummary] = useState<string>('');

  const handleFileSelected = useCallback(async (file: File) => {
    setIsProcessing(true);
    setAnalysisComplete(false);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      // Parse all rows
      const parsedData: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length < headers.length) continue;
        const row: Record<string, string> = {};
        headers.forEach((h, j) => { row[h] = values[j] || ''; });
        parsedData.push(row);
      }

      // Analyze columns
      const columns = analyzeDataset(headers, parsedData);
      const { targetColumn, featureColumns } = inferColumns(headers, parsedData, columns);

      // Dispatch to store
      dispatch({
        type: 'SET_DATASET',
        payload: {
          meta: {
            id: crypto.randomUUID(),
            filename: file.name,
            uploadedAt: new Date().toISOString(),
            rowCount: parsedData.length,
            columnCount: headers.length,
            fileSizeBytes: file.size,
            status: 'uploaded',
          },
          rawCsv: text,
          headers,
          parsedData,
          columns,
          suggestedTargetColumn: targetColumn,
          suggestedFeatureColumns: featureColumns,
        },
      });

      // Build summary
      const numericCount = columns.filter(c => c.type === 'numeric').length;
      const catCount = columns.filter(c => c.type === 'categorical').length;
      const missingCols = columns.filter(c => c.missingCount > 0).length;
      setColumnSummary(
        `Found ${numericCount} numeric and ${catCount} categorical columns. ` +
        `${missingCols > 0 ? `${missingCols} columns have missing values.` : 'No missing values detected.'} ` +
        (targetColumn ? `Suggested target: "${targetColumn}"` : 'No target column identified — you can set one during training.')
      );

      setAnalysisComplete(true);
    } catch (err) {
      console.error('File processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [dispatch]);

  return (
    <div className="space-y-8 animate-fade-in">
      <WizardStepper currentStep={1} />

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Upload Your Dataset
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Drop a CSV file to get started. Maximum 20MB.
        </p>
      </div>

      {/* Upload zone */}
      <UploadZone
        onFileSelected={handleFileSelected}
        isUploading={isProcessing}
        maxSizeMb={20}
      />

      {/* Analysis results */}
      {analysisComplete && state.dataset.meta && (
        <div className="space-y-6 animate-fade-in">
          {/* Success card */}
          <div className="flex items-center gap-4 p-5 bg-[var(--color-success-subtle)] border border-[var(--color-success-muted)] rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-[var(--color-success-default)] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {state.dataset.meta.filename} processed successfully
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {state.dataset.meta.rowCount.toLocaleString()} rows × {state.dataset.meta.columnCount} columns
              </p>
            </div>
          </div>

          {/* Column analysis insight */}
          <AiInsightCard title="Column Analysis" source="Heuristic column type detection">
            <p>{columnSummary}</p>
          </AiInsightCard>

          {/* Data preview */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Data Preview (first 5 rows)</h3>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-border-subtle)]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-2)]">
                    {state.dataset.headers.slice(0, 10).map(h => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)]">
                        {h}
                      </th>
                    ))}
                    {state.dataset.headers.length > 10 && (
                      <th className="px-3 py-2 text-left text-[var(--color-text-tertiary)] border-b border-[var(--color-border-subtle)]">
                        +{state.dataset.headers.length - 10} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {state.dataset.parsedData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-white-05)]">
                      {state.dataset.headers.slice(0, 10).map(h => (
                        <td key={h} className="px-3 py-2 text-[var(--color-text-secondary)] font-mono-metric">
                          {row[h]?.substring(0, 20) || '—'}
                        </td>
                      ))}
                      {state.dataset.headers.length > 10 && <td className="px-3 py-2" />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end">
            <Button
              onClick={() => router.push('/explore')}
              className="bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white gap-2"
            >
              Explore Data
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

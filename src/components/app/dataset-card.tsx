"use client";

import { cn } from '@/lib/utils';
import { FileSpreadsheet, Clock, Columns, Rows3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DatasetCardProps {
  filename: string;
  rowCount: number;
  columnCount: number;
  uploadedAt: string;
  status: 'uploaded' | 'analyzed' | 'cleaned';
  fileSizeBytes?: number;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  uploaded: { label: 'Uploaded', className: 'bg-[var(--color-info-subtle)] text-[var(--color-info-default)] border-[var(--color-info-muted)]' },
  analyzed: { label: 'Analyzed', className: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning-default)] border-[var(--color-warning-muted)]' },
  cleaned:  { label: 'Cleaned', className: 'bg-[var(--color-success-subtle)] text-[var(--color-success-default)] border-[var(--color-success-muted)]' },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export function DatasetCard({ filename, rowCount, columnCount, uploadedAt, status, fileSizeBytes, onClick, className }: DatasetCardProps) {
  const statusCfg = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-lg p-5 transition-all duration-200 hover:border-[var(--color-border-default)] group",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-3)] flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-[var(--color-accent-500)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[200px]">
              {filename}
            </p>
            {fileSizeBytes && (
              <p className="text-xs text-[var(--color-text-tertiary)]">{formatBytes(fileSizeBytes)}</p>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn("text-[10px] font-semibold border", statusCfg.className)}>
          {statusCfg.label}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5">
          <Rows3 className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-mono-metric">{rowCount.toLocaleString()}</span> rows
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Columns className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-mono-metric">{columnCount}</span> cols
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
          <span className="text-xs text-[var(--color-text-tertiary)]">{formatTime(uploadedAt)}</span>
        </div>
      </div>
    </div>
  );
}

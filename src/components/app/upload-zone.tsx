"use client";

import { useCallback, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
  acceptedTypes?: string[];
  maxSizeMb?: number;
  className?: string;
}

export function UploadZone({
  onFileSelected,
  isUploading = false,
  acceptedTypes = ['.csv'],
  maxSizeMb = 20,
  className,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !acceptedTypes.some(t => t.replace('.', '') === ext)) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSizeMb}MB`;
    }
    if (file.size === 0) {
      return 'File is empty';
    }
    return null;
  }, [acceptedTypes, maxSizeMb]);

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file);
    if (err) {
      setError(err);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
    onFileSelected(file);
  }, [validateFile, onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center",
          !selectedFile && "cursor-pointer",
          isDragging
            ? "border-[var(--color-accent-500)] bg-[rgba(232,64,64,0.06)]"
            : error
            ? "border-[var(--color-error-default)] bg-[var(--color-error-subtle)]"
            : selectedFile
            ? "border-[var(--color-success-default)] bg-[var(--color-success-subtle)]"
            : "border-[var(--color-border-default)] bg-[var(--color-surface-1)] hover:border-[var(--color-accent-500)] hover:bg-[rgba(232,64,64,0.03)]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload CSV file"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent-500)] border-t-transparent animate-spin" />
            <p className="text-sm text-[var(--color-text-secondary)]">Processing file...</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-success-muted)] flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-[var(--color-success-default)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{selectedFile.name}</p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{formatSize(selectedFile.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-error-default)]"
            >
              <X className="w-3 h-3 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-3)] flex items-center justify-center">
              <Upload className="w-6 h-6 text-[var(--color-text-tertiary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Drop your CSV file here, or{' '}
                <span className="text-[var(--color-accent-500)]">browse</span>
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                CSV files up to {maxSizeMb}MB
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 justify-center text-xs text-[var(--color-error-default)]">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

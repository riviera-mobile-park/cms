// page.tsx (import)
// Import homes data from spreadsheet

'use client';

import { useState, useRef } from 'react';
import { FileSpreadsheet, Upload, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { toErrorMessage } from '@/lib/utils/error';

interface ImportResult {
  success: boolean;
  message: string;
  added?: number;
  updated?: number;
  errors?: string[];
}

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const ext = file.name.toLowerCase();
      if (ext.endsWith('.csv')) {
        setSelectedFile(file);
        setResult(null);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }

      const data: ImportResult = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = toErrorMessage(error);
      toast.error(`Import failed: ${message}`);
      setResult({
        success: false,
        message: message,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Import Homes Data</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[42px]">
            Upload a CSV file to add or update home listings
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-card border border-border rounded-lg p-4 mb-3">
          <h2 className="text-base font-semibold mb-2 text-foreground">How to Import</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground mb-3">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>Download the sample CSV template below</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>Fill in your home data following the column format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>Upload the completed CSV file using the form below</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>Existing homes will be updated, new homes will be added</span>
            </li>
          </ul>
          <a
            href="/update-spaces.csv"
            download="update-spaces.csv"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Download Sample CSV Template
          </a>
        </div>

        {/* Upload Area */}
        <div className="bg-card border border-border rounded-lg p-4">
          {!selectedFile ? (
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground mb-0.5">
                    Drop your CSV file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                >
                  Select File
                </button>
                <p className="text-xs text-muted-foreground">
                  Supports CSV files only
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Selected File */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  disabled={isImporting}
                  className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="w-full px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className={`
            mt-3 border rounded-lg p-4
            ${result.success 
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }
          `}>
            <div className="flex items-start gap-2.5">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-1.5 text-sm ${
                  result.success 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  {result.success ? 'Import Successful' : 'Import Failed'}
                </h3>
                <p className={`text-sm mb-2 ${
                  result.success 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {result.message}
                </p>
                {result.added !== undefined && result.updated !== undefined && (
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-medium text-green-900 dark:text-green-100">Added: </span>
                      <span className="text-green-800 dark:text-green-200">{result.added}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-900 dark:text-green-100">Updated: </span>
                      <span className="text-green-800 dark:text-green-200">{result.updated}</span>
                    </div>
                  </div>
                )}
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">Errors:</p>
                    <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                      {result.errors.map((error, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

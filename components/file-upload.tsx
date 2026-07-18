"use client";

import { useState, useRef } from 'react';
import { CloudUpload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  caseId: string;
  onUploadComplete?: (records: any[]) => void;
}

export function FileUpload({ caseId, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const res = await fetch(`/api/cases/${caseId}/records`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const records = await res.json();
      setUploaded(true);
      setFiles([]);
      onUploadComplete?.(records);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="p-6 rounded-xl border-2 border-dashed border-healing-teal/30 bg-healing-teal/5 text-center">
        <CheckCircle2 className="size-10 text-healing-teal mx-auto mb-2" />
        <p className="text-healing-teal font-medium text-sm">Files uploaded successfully</p>
        <button
          onClick={() => setUploaded(false)}
          className="mt-3 text-clinical-navy text-sm font-medium hover:text-healing-teal transition-colors"
        >
          Upload more files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          isDragging
            ? 'border-clinical-navy bg-clinical-navy/5'
            : 'border-surface-gray bg-surface hover:border-clinical-navy/30'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
            isDragging ? 'bg-clinical-navy/10 text-clinical-navy' : 'bg-evidence-blue-light/50 text-on-surface-variant'
          }`}>
            <CloudUpload className="size-6" />
          </div>
          <p className="font-medium text-text-medical-black text-sm">
            {isDragging ? 'Drop files here' : 'Upload records'}
          </p>
          <p className="text-on-surface-variant text-xs mt-1">
            PDF, JPEG, PNG, WebP — up to 50MB each
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.dcm,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface"
            >
              <FileText className="size-4 text-on-surface-variant shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-medical-black truncate">{file.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-on-surface-variant hover:text-error transition-colors p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 bg-clinical-navy text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-clinical-navy/90 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="size-4" />
                Upload {files.length} file{files.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

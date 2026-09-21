"use client";

import { useState, useRef } from 'react';
import { CloudUpload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export interface UploadedRecord {
  id: string;
  caseId: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  uploadedAt: string;
}

interface FileUploadProps {
  caseId: string;
  onUploadComplete?: (records: UploadedRecord[]) => void;
}

export function FileUpload({ caseId, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation<UploadedRecord[], Error, File[]>({
    mutationFn: async (selectedFiles: File[]) => {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('files', file));

      const res = await fetch(`/api/cases/${caseId}/records`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      return res.json();
    },
    onSuccess: (records) => {
      setError(null);
      setUploaded(true);
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.detail(caseId) });
      onUploadComplete?.(records);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const uploading = uploadMutation.isPending;

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

  const handleUpload = () => {
    if (files.length === 0) return;
    setError(null);
    uploadMutation.mutate(files);
  };

  if (uploaded) {
    return (
      <div className="p-6 rounded-xl border-2 border-dashed border-[#15803D]/30 bg-[#15803D]/5 text-center">
        <CheckCircle2 className="size-10 text-[#15803D] mx-auto mb-2" />
        <p className="text-[#15803D] font-medium text-sm">Files uploaded successfully</p>
        <button
          onClick={() => setUploaded(false)}
          className="mt-3 text-[#1E3A5F] text-sm font-medium hover:text-[#15803D] transition-colors"
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
            ? 'border-[#1E3A5F] bg-[#1E3A5F]/5'
            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#1E3A5F]/30'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
            isDragging ? 'bg-[#1E3A5F]/10 text-[#1E3A5F]' : 'bg-[#DBEAFE]/50 text-[#64748B]'
          }`}>
            <CloudUpload className="size-6" />
          </div>
          <p className="font-medium text-[#0F172A] text-sm">
            {isDragging ? 'Drop files here' : 'Upload records'}
          </p>
          <p className="text-[#64748B] text-xs mt-1">
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
              className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC]"
            >
              <FileText className="size-4 text-[#64748B] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">{file.name}</p>
                <p className="text-xs text-[#64748B]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-[#64748B] hover:text-[#B91C1C] transition-colors p-1"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1E3A5F] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#1E3A5F]/90 transition-colors disabled:opacity-50"
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
        <div role="alert" className="rounded-xl border border-pulse-red/30 bg-pulse-red-light p-3 text-sm text-pulse-red">
          {error}
        </div>
      )}
    </div>
  );
}

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileUpload } from '@/components/file-upload';

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn();
});

function createMockFile(name: string, type: string, size: number): File {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
}

function renderFileUpload(props: { caseId: string }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <FileUpload {...props} />
    </QueryClientProvider>
  );
}

describe('FileUpload', () => {
  it('renders upload area', () => {
    const { container } = renderFileUpload({ caseId: 'case-1' });
    expect(container.querySelector('[class*="cursor-pointer"]')).toBeInTheDocument();
    expect(screen.getAllByText('Upload records').length).toBeGreaterThan(0);
  });

  it('shows file type restrictions', () => {
    renderFileUpload({ caseId: 'case-1' });
    const restrictionTexts = screen.getAllByText(/up to 50MB each/);
    expect(restrictionTexts.length).toBeGreaterThan(0);
    expect(restrictionTexts[0]).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const user = userEvent.setup();
    const { container } = renderFileUpload({ caseId: 'case-1' });

    const file = createMockFile('test.pdf', 'application/pdf', 1024);
    const input = container.querySelector('input[type="file"]')!;
    await user.upload(input, file);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    const uploadButtons = screen.getAllByRole('button', { name: /upload/i });
    expect(uploadButtons[0]).toBeInTheDocument();
  });

  it('shows error for invalid file type', async () => {
    const user = userEvent.setup();
    const { container } = renderFileUpload({ caseId: 'case-1' });

    const file = createMockFile('test.exe', 'application/x-msdownload', 1024);
    const input = container.querySelector('input[type="file"]')!;
    await user.upload(input, file);

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid file type. Accepted: PDF, JPEG, PNG, WebP, DICOM' }),
    });

    const uploadButtons = screen.getAllByRole('button', { name: /upload/i });
    await user.click(uploadButtons[0]);
    expect(await screen.findByText(/Invalid file type/)).toBeInTheDocument();
  });

  it('shows error for oversized file', async () => {
    const user = userEvent.setup();
    const { container } = renderFileUpload({ caseId: 'case-1' });

    const oversized = createMockFile('large.pdf', 'application/pdf', 60 * 1024 * 1024);
    const input = container.querySelector('input[type="file"]')!;
    await user.upload(input, oversized);

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'File exceeds maximum size of 50 MB' }),
    });

    const uploadButtons = screen.getAllByRole('button', { name: /upload/i });
    await user.click(uploadButtons[0]);
    expect(await screen.findByText(/exceeds maximum size/)).toBeInTheDocument();
  });
});

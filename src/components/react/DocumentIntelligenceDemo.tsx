'use client';

import { useMemo, useState } from 'react';
import { APP_URL } from '@/lib/site';
import {
  DOCUMENT_DEMO_API_URL,
  MARKETING_DEMO_DOC_SLOTS,
  type DemoCheckResponse,
  type DemoCheckStatus,
} from '@/data/marketing-document-demo';

type Phase = 'upload' | 'scanning' | 'results';

const MAX_BYTES = 8 * 1024 * 1024;

const statusChip: Record<
  DemoCheckStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  PASS: { label: 'Pass', bg: '#eaf6e0', color: '#2f6b1c', dot: '#4a9c2d' },
  WARNING: { label: 'Review', bg: '#fff8e6', color: '#8a6a00', dot: '#e6a209' },
  FAIL: { label: 'Fix', bg: '#fdecec', color: '#a12727', dot: '#d64545' },
};

export default function DocumentIntelligenceDemo() {
  const [phase, setPhase] = useState<Phase>('upload');
  const [files, setFiles] = useState<Record<string, File>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DemoCheckResponse | null>(null);
  const [scanStatus, setScanStatus] = useState('Preparing documents…');

  const attachedCount = Object.keys(files).length;
  const canRun = attachedCount >= 2;

  const rows = useMemo(
    () =>
      MARKETING_DEMO_DOC_SLOTS.map((slot) => {
        const file = files[slot.type];
        const done = !!file;
        return { slot, file, done };
      }),
    [files]
  );

  const onPick = (type: string, list: FileList | null) => {
    const file = list?.[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError(`File must be under ${MAX_BYTES / (1024 * 1024)}MB.`);
      return;
    }
    setError(null);
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const runScan = async () => {
    if (!canRun) return;
    setError(null);
    setPhase('scanning');
    setScanStatus('Uploading documents…');

    const form = new FormData();
    for (const [type, file] of Object.entries(files)) {
      form.append(`file_${type}`, file);
    }

    try {
      setScanStatus('Cross-checking fields with AI…');
      const res = await fetch(DOCUMENT_DEMO_API_URL, {
        method: 'POST',
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as DemoCheckResponse & { error?: string };
      if (!res.ok) {
        setPhase('upload');
        setError(data.error || 'Could not run the demo check.');
        return;
      }
      setResult(data);
      setPhase('results');
    } catch (err) {
      setPhase('upload');
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError(
          'Could not reach the document check service. Ensure Exportation-Tracker is running on port 3001, use http://localhost:4321 (not 127.0.0.1 unless both match), and check the browser console for CORS errors.'
        );
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  const reset = () => {
    setPhase('upload');
    setFiles({});
    setResult(null);
    setError(null);
  };

  const failCount = result?.checks.filter((c) => c.status === 'FAIL').length ?? 0;
  const passCount = result ? result.checks.filter((c) => c.status === 'PASS').length : 0;

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_20px_50px_rgba(13,44,77,0.14)]">
      <div className="flex h-[34px] items-center gap-1.5 border-b border-[var(--line)] bg-[#eef1f4] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e05c54]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e6a209]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a9c2d]" />
        <span className="ml-3 font-mono text-[11px] text-[#9aa2aa]">app.omgexp.com/document-intelligence</span>
      </div>

      {phase === 'upload' && (
        <div className="p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-display text-[15px] font-bold" style={{ color: 'var(--navy-950)' }}>
              Check your documents
            </span>
            <span
              className="text-[12.5px] font-semibold"
              style={{ color: canRun ? '#4a8a2d' : '#9aa2aa' }}
            >
              {attachedCount} / {MARKETING_DEMO_DOC_SLOTS.length} attached
            </span>
          </div>
          <p className="mb-3.5 text-[12.5px] leading-snug" style={{ color: '#7a838c' }}>
            Attach your export paperwork — our AI cross-references every field to catch mismatches before
            cargo flies.
          </p>
          <p className="mb-3 text-[11px] leading-snug" style={{ color: '#9aa2aa' }}>
            Demo only — files are analyzed in memory and not stored.{' '}
            <a href={`${APP_URL}/site/login`} className="font-semibold underline" style={{ color: 'var(--navy-700)' }}>
              Sign in to the Export Portal
            </a>{' '}
            to attach documents to a shipment.
          </p>
          <div className="mb-4 flex flex-col gap-2">
            {rows.map(({ slot, file, done }) => (
              <label
                key={slot.type}
                className="flex cursor-pointer items-center gap-3 rounded-[5px] border-[1.5px] px-3 py-2.5 transition-colors hover:border-[var(--green-500)]"
                style={{
                  borderColor: done ? '#8ccd6a' : 'var(--line)',
                  background: done ? '#f4fbee' : '#fff',
                }}
              >
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => onPick(slot.type, e.target.files)}
                />
                <span
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[4px] text-white"
                  style={{ background: done ? 'var(--green-500)' : '#e6eef6', color: done ? '#fff' : 'var(--navy-700)' }}
                >
                  {done ? '✓' : '📄'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold leading-tight" style={{ color: 'var(--ink)' }}>
                    {slot.label}
                    {slot.primary ? ' · primary' : ''}
                  </span>
                  <span
                    className="block truncate text-[11.5px]"
                    style={{ color: done ? '#4a8a2d' : '#9aa2aa' }}
                  >
                    {done ? file?.name : slot.hint}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold"
                  style={{
                    color: done ? '#3d6b26' : '#5c656e',
                    background: done ? 'rgba(111,190,68,.16)' : '#f1f3f5',
                    borderColor: done ? '#b6dd97' : 'var(--line)',
                  }}
                >
                  {done ? 'Attached' : 'Add file'}
                </span>
              </label>
            ))}
          </div>
          {error && (
            <div
              className="mb-3 rounded-[var(--radius-sm)] border px-3 py-2 text-[13px]"
              style={{ borderColor: '#f5c2c2', background: '#fdecec', color: '#a12727' }}
            >
              {error}
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!canRun}
              onClick={runScan}
              className="inline-flex items-center gap-2 rounded-[3px] px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed"
              style={{ background: canRun ? 'var(--navy-700)' : '#c4cad0' }}
            >
              Run Scan
            </button>
          </div>
        </div>
      )}

      {phase === 'scanning' && (
        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-[3px] border-[var(--line)] border-t-[var(--green-500)]"
              aria-hidden
            />
            <div>
              <div className="font-display text-[15px] font-bold" style={{ color: 'var(--navy-950)' }}>
                Scanning {attachedCount} documents…
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {scanStatus} This may take a few minutes — please stay on this page.
              </div>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#eef1f4]">
            <div
              className="h-full animate-pulse rounded-full"
              style={{ width: '66%', background: 'linear-gradient(90deg,#184878,#6fbe44)' }}
            />
          </div>
        </div>
      )}

      {phase === 'results' && result && (
        <div>
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f4] px-5 py-4"
            style={{ background: '#f8f9fa' }}
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: '#9aa2aa' }}>
                Document Analysis Report
              </div>
              <div className="font-display text-[15px] font-bold" style={{ color: 'var(--navy-950)' }}>
                {passCount} passed · {failCount} to fix
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{
                background:
                  result.overallStatus === 'PASS'
                    ? '#4a9c2d'
                    : result.overallStatus === 'WARNING'
                      ? '#e6a209'
                      : '#d64545',
              }}
            >
              {result.overallStatus === 'PASS' ? '● All clear' : '● Action needed'}
            </span>
          </div>
          <div className="max-h-[300px] overflow-auto px-5 py-2">
            {result.checks.map((c, i) => {
              const chip = statusChip[c.status] || statusChip.WARNING;
              return (
                <div
                  key={i}
                  className="flex gap-3 border-b border-[#f1f3f5] py-3 last:border-0"
                >
                  <span
                    className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ background: chip.dot }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                        {c.name}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{ background: chip.bg, color: chip.color }}
                      >
                        {chip.label}
                      </span>
                    </div>
                    {c.details && (
                      <p className="mt-1 text-[12px] leading-relaxed" style={{ color: '#5c656e' }}>
                        {c.details}
                      </p>
                    )}
                    {c.message && c.status !== 'PASS' && (
                      <p
                        className="mt-1 text-[12px] leading-relaxed"
                        style={{ color: c.status === 'FAIL' ? '#a12727' : '#8a6a00' }}
                      >
                        {c.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eef1f4] px-5 py-3">
            <p className="text-[11px]" style={{ color: '#9aa2aa' }}>
              Automated demo pre-check — not a final approval.
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-[12.5px] font-semibold underline"
              style={{ color: 'var(--navy-700)' }}
            >
              Check again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

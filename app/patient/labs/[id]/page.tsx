"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLabResult } from '@/lib/hooks/use-lab-results';
import type { MetricStatus } from '@/lib/generated/prisma/enums';

const STATUS_BADGE: Record<string, string> = {
  NORMAL: 'bg-pulse-success-light text-pulse-success',
  HIGH: 'bg-pulse-red-light text-pulse-red',
  LOW: 'bg-pulse-red-light text-pulse-red',
};

export default function LabResultDetails() {
  const params = useParams();
  const { data: labResult, isLoading } = useLabResult(params.id as string);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4 md:p-8">
        <Loader2 className="animate-spin text-pulse-info" size={32} aria-label="Loading lab result" />
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 md:p-8 pb-24">
        <p className="text-lg text-pulse-text-secondary">Lab result not found.</p>
        <Link href="/patient/labs" className="text-sm font-medium text-pulse-info hover:underline">
          Back to labs
        </Link>
      </div>
    );
  }

  const dateStr = new Date(labResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 pb-24 md:pb-8">
      <Link
        href="/patient/labs"
        className="mb-2 inline-flex items-center gap-2 text-pulse-text-secondary transition-colors hover:text-pulse-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span className="text-sm">Back to labs</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-pulse-navy md:text-3xl">
            {labResult.name}
          </h1>
          <p className="text-sm text-pulse-text-secondary">
            Tested on {dateStr} &middot; Ordered by {labResult.doctor}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-pulse-border bg-pulse-surface px-4 py-2 text-sm font-medium text-pulse-navy shadow-soft transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
          >
            <Download className="size-4" aria-hidden="true" />
            Download PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="mb-4 text-lg font-semibold text-pulse-navy">Key metrics</h2>
            <div className="overflow-hidden rounded-xl border border-pulse-border bg-pulse-surface shadow-soft">
              <div className="divide-y divide-pulse-border">
                {labResult.metrics?.map((metric: { id: string; name: string; value: number; unit: string; status: MetricStatus; referenceRange: string }) => (
                  <div
                    key={metric.id}
                    className={`flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center ${
                      metric.status !== 'NORMAL' ? 'bg-pulse-red-light/50' : ''
                    }`}
                  >
                    <div>
                      <h3 className="text-base font-semibold text-pulse-navy">{metric.name}</h3>
                      <p className="mt-0.5 text-sm text-pulse-text-muted">
                        Reference range: {metric.referenceRange}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span
                          className={`font-mono text-2xl font-semibold tabular-nums ${
                            metric.status === 'NORMAL' ? 'text-pulse-navy' : 'text-pulse-red'
                          }`}
                        >
                          {metric.value}
                        </span>
                        <span className="ml-1 text-sm text-pulse-text-secondary">{metric.unit}</span>
                      </div>
                      <span
                        className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ${
                          STATUS_BADGE[metric.status] || STATUS_BADGE.NORMAL
                        }`}
                      >
                        {metric.status === 'HIGH' ? 'High' : metric.status === 'LOW' ? 'Low' : 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {labResult.trends && labResult.trends.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="mb-4 text-lg font-semibold text-pulse-navy">Historical trend</h2>
              <div className="h-72 rounded-xl border border-pulse-border bg-pulse-surface p-4 shadow-soft">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={labResult.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e7ee" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#48566b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#48566b' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e3e7ee', boxShadow: '0 12px 24px -12px rgba(11, 54, 111, 0.28)' }}
                      itemStyle={{ color: '#101828', fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.section>
          )}
        </div>

        {labResult.aiInterpretation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <section className="rounded-xl border border-pulse-info/30 bg-pulse-info-light p-5">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-pulse-navy">
                <Sparkles className="size-4 text-pulse-info" aria-hidden="true" />
                AI-generated draft
              </h2>
              <p className="text-sm leading-relaxed text-pulse-text-secondary">{labResult.aiInterpretation}</p>
              <p className="mt-3 text-xs text-pulse-text-muted">
                This is an AI draft, not a diagnosis. A board-certified physician reviews all
                findings before they are final.
              </p>
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
}

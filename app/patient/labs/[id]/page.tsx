"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLabResult } from '@/lib/hooks/use-lab-results';
import type { MetricStatus } from '@/lib/generated/prisma/enums';

const statusColor: Record<string, string> = {
  NORMAL: 'bg-healing-teal/10 text-healing-teal',
  HIGH: 'bg-error/10 text-error',
  LOW: 'bg-error/10 text-error',
};

export default function LabResultDetails() {
  const params = useParams();
  const { data: labResult, isLoading } = useLabResult(params.id as string);

  if (isLoading) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-healing-teal" size={32} />
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-on-surface-variant text-lg">Lab result not found.</p>
        <Link href="/patient/labs" className="text-healing-teal hover:underline text-sm">Back to Labs</Link>
      </div>
    );
  }

  const dateStr = new Date(labResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 space-y-stack-lg">
      <Link href="/patient/labs" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-clinical-navy transition-colors mb-2">
        <ArrowLeft className="text-sm" />
        <span className="font-label-md text-sm">Back to Labs</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl mb-1">{labResult.name}</h1>
          <p className="text-on-surface-variant text-sm">Tested on {dateStr} • Ordered by {labResult.doctor}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-surface-gray rounded-lg text-clinical-navy font-label-md text-sm hover:bg-surface-container-low transition-colors shadow-sm">
            <Download className="text-sm" />
            Download PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4">Key Metrics</h2>
            <div className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
              <div className="divide-y divide-surface-gray">
                {labResult.metrics?.map((metric: { id: string; name: string; value: number; unit: string; status: MetricStatus; referenceRange: string }) => (
                  <div
                    key={metric.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4${metric.status === 'HIGH' || metric.status === 'LOW' ? ' bg-error/5' : ''}`}
                  >
                    <div>
                      <h3 className="font-bold text-clinical-navy text-base">{metric.name}</h3>
                      <p className="text-on-surface-variant text-sm mt-0.5">Reference range: {metric.referenceRange}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`font-headline-lg font-bold text-2xl ${metric.status === 'NORMAL' ? 'text-clinical-navy' : 'text-error'}`}>{metric.value}</span>
                        <span className="text-on-surface-variant text-sm ml-1">{metric.unit}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[metric.status] || 'bg-healing-teal/10 text-healing-teal'}`}>
                        {metric.status === 'HIGH' ? 'High' : metric.status === 'LOW' ? 'Low' : 'Normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Trend Chart */}
          {labResult.trends && labResult.trends.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4">Historical Trend</h2>
              <div className="card border border-surface-gray shadow-sm bg-surface p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={labResult.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#00796B" strokeWidth={3} dot={{ r: 4, fill: '#00796B', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.section>
          )}
        </div>

        {/* AI Interpretation */}
        {labResult.aiInterpretation && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <section>
              <h2 className="font-headline-md text-clinical-navy font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-healing-teal" />
                AI Interpretation
              </h2>
              <div className="card p-5 border border-evidence-blue-light shadow-sm bg-gradient-to-br from-surface to-evidence-blue-light/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-healing-teal/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <p className="text-on-surface-variant text-sm leading-relaxed">{labResult.aiInterpretation}</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
}

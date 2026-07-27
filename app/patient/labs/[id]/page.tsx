"use client"
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Sparkles, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLabResult } from '@/lib/hooks/use-lab-results';
import type { MetricStatus } from '@/lib/generated/prisma/enums';

const statusColor: Record<string, string> = {
  NORMAL: 'bg-[#15803D]/10 text-[#15803D]',
  HIGH: 'bg-[#B91C1C]/10 text-[#B91C1C]',
  LOW: 'bg-[#B91C1C]/10 text-[#B91C1C]',
};

export default function LabResultDetails() {
  const params = useParams();
  const { data: labResult, isLoading } = useLabResult(params.id as string);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#15803D]" size={32} />
      </div>
    );
  }

  if (!labResult) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-[#64748B] text-lg">Lab result not found.</p>
        <Link href="/patient/labs" className="text-[#15803D] hover:underline text-sm">Back to Labs</Link>
      </div>
    );
  }

  const dateStr = new Date(labResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-6">
      <Link href="/patient/labs" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#1E3A5F] transition-colors mb-2">
        <ArrowLeft className="text-sm" />
        <span className="text-sm">Back to Labs</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl mb-1">{labResult.name}</h1>
          <p className="text-[#64748B] text-sm">Tested on {dateStr} • Ordered by {labResult.doctor}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#1E3A5F] text-sm hover:bg-[#F1F5F9] transition-colors shadow-sm">
            <Download className="text-sm" />
            Download PDF
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-[#1E3A5F] font-bold text-lg mb-4">Key Metrics</h2>
            <div className="card border border-[#E2E8F0] shadow-sm bg-[#F8FAFC] overflow-hidden">
              <div className="divide-y divide-[#E2E8F0]">
                {labResult.metrics?.map((metric: { id: string; name: string; value: number; unit: string; status: MetricStatus; referenceRange: string }) => (
                  <div
                    key={metric.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4${metric.status === 'HIGH' || metric.status === 'LOW' ? ' bg-[#B91C1C]/5' : ''}`}
                  >
                    <div>
                      <h3 className="font-bold text-[#1E3A5F] text-base">{metric.name}</h3>
                      <p className="text-[#64748B] text-sm mt-0.5">Reference range: {metric.referenceRange}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`font-bold text-2xl ${metric.status === 'NORMAL' ? 'text-[#1E3A5F]' : 'text-[#B91C1C]'}`}>{metric.value}</span>
                        <span className="text-[#64748B] text-sm ml-1">{metric.unit}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[metric.status] || 'bg-[#15803D]/10 text-[#15803D]'}`}>
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
              <h2 className="text-[#1E3A5F] font-bold text-lg mb-4">Historical Trend</h2>
              <div className="card border border-[#E2E8F0] shadow-sm bg-[#F8FAFC] p-4 h-72">
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
              <h2 className="text-[#1E3A5F] font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-[#15803D]" />
                AI Interpretation
              </h2>
              <div className="card p-5 border border-[#DBEAFE] shadow-sm bg-gradient-to-br from-[#F8FAFC] to-[#DBEAFE]/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#15803D]/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-4">
                  <p className="text-[#64748B] text-sm leading-relaxed">{labResult.aiInterpretation}</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
}

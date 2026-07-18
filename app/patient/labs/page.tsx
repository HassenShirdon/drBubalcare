"use client"
import Link from 'next/link';
import { motion } from 'motion/react';
import { CloudUpload, Filter, ChevronRight, Droplets, FlaskConical, Sun, Loader2 } from 'lucide-react';
import { useLabResults } from '@/lib/hooks/use-lab-results';
import { useLabsStore } from '@/lib/stores/labs-store';
import type { LabStatus } from '@/lib/generated/prisma/enums';

const iconMap: Record<string, React.ReactNode> = {
  bloodtype: <Droplets />,
  science: <FlaskConical />,
  sunny: <Sun />,
};

export default function LabsPortal() {
  const { data: labResults, isLoading } = useLabResults();
  const { filterStatus, setFilterStatus } = useLabsStore();

  const filtered = filterStatus
    ? labResults?.filter((lab: { status: LabStatus }) => lab.status === filterStatus)
    : labResults;

  return (
    <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 space-y-stack-xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-caption text-on-surface-variant text-sm mb-1">Patient Portal</p>
        <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl">Lab Portal</h1>
      </motion.div>

      {/* Upload Area */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="upload-area p-8 rounded-xl border-2 border-dashed border-surface-gray bg-surface flex flex-col items-center justify-center text-center cursor-pointer hover:border-healing-teal transition-colors group">
          <div className="w-16 h-16 rounded-full bg-evidence-blue-light/50 flex items-center justify-center text-clinical-navy mb-4 group-hover:scale-110 transition-transform">
            <CloudUpload className="text-3xl" />
          </div>
          <h3 className="font-headline-md text-clinical-navy font-bold text-lg mb-1">Upload New Lab Results</h3>
          <p className="text-on-surface-variant text-sm max-w-sm">Drag and drop your PDF results here, or click to browse files.</p>
        </div>
      </motion.section>

      {/* Results List */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-md text-clinical-navy font-bold text-lg">Historical Results</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus(filterStatus === 'REVIEW_NEEDED' ? null : 'REVIEW_NEEDED')}
              className={`p-1 transition-colors ${filterStatus === 'REVIEW_NEEDED' ? 'text-error' : 'text-on-surface-variant hover:text-clinical-navy'}`}
            >
              <Filter />
            </button>
          </div>
        </div>
        
        <div className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
          <div className="divide-y divide-surface-gray">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-healing-teal" size={24} />
              </div>
            ) : filtered && filtered.length > 0 ? (
              filtered.map((lab: { id: string; name: string; date: string; doctor: string; status: LabStatus; icon: string }) => (
                <Link href={`/patient/labs/${lab.id}`} key={lab.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-evidence-blue-light/50 group-hover:text-clinical-navy transition-colors shrink-0">
                      {iconMap[lab.icon]}
                    </div>
                    <div>
                      <h3 className="font-headline-md font-bold text-clinical-navy text-base">{lab.name}</h3>
                      <p className="text-on-surface-variant text-sm mt-0.5">{lab.date} • {lab.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold ${lab.status === 'REVIEW_NEEDED' ? 'bg-error/10 text-error' : 'bg-healing-teal/10 text-healing-teal'}`}>
                      {lab.status === 'REVIEW_NEEDED' ? 'Review Needed' : 'Normal'}
                    </span>
                    <ChevronRight className="text-on-surface-variant text-sm group-hover:text-healing-teal transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-on-surface-variant text-sm">No lab results found.</div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
